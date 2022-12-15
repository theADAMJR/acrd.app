import { WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';

type OnWS = WS.To & WS.On;

export interface WSEvent<K extends keyof OnWS> {
  on: K;
  cooldown?: number;
  invoke: (ws: WebSocket, client: Socket, params: OnWS[K]) => Promise<(WSAction<keyof WS.From> | undefined)[]>;
}

export interface WSAction<K extends keyof WS.From> {
  emit: K;
  to: string[];
  send: WS.From[K];
}