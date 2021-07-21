import { Socket } from 'socket.io';
import { WS } from '../websocket';

export interface WSEvent<K extends keyof WSEventParams> {
  on: K;

  invoke: (ws: WS, client: Socket, params: WSEventParams[K]) => Promise<any>;
}