import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export class Disconnect implements WSEvent<'disconnect'> {
  public on = 'disconnect' as const;

  public async invoke(ws: WS, client: Socket) {
    ws.sessions.delete(client.id);
  }
}