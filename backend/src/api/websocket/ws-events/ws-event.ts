import { Socket } from 'socket.io';
import { WSEventParams } from '../../../data/types/ws-types';
import { WebSocket } from '../websocket';

export interface WSEvent<K extends keyof WSEventParams> {
  on: K;
  cooldown?: number;

  invoke: (ws: WebSocket, client: Socket, params: WSEventParams[K]) => Promise<any>;
}

export { Args, Params, WSEventParams } from '../../../data/types/ws-types';
