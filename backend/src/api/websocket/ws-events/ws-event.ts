import { Socket } from 'socket.io';
import { WS } from '../../../types/ws';
import { WebSocket } from '../websocket';

type OnWS = WS.To | WS.On;

export interface WSEvent<K extends keyof WS.To> {
  on: K;
  cooldown?: number;

  invoke: (ws: WebSocket, client: Socket, params: WS.To[K]) => Promise<any>;
}
