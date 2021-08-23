import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';

type OnWS = WS.To | WS.OnWS;

export interface WSEvent<K extends keyof OnWS> {
  on: K;
  cooldown?: number;

  invoke: (ws: WebSocket, client: Socket, params: OnWS[K]) => Promise<any>;
}
