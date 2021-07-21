import { Socket } from 'socket.io';
import { snowflake } from '../../utils/snowflake';
import { temp } from '../../utils/temp';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export class Disconnect implements WSEvent<'disconnect'> {
  public on = 'disconnect' as const;

  public async invoke(ws: WS, client: Socket) {
    const userId = ws.sessions.get(client.id);
    const index = temp.users.findIndex(u => u.id === userId);
    temp.users.splice(index, 1);
  }
}