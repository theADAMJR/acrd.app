import { Socket } from 'socket.io';
import { snowflake } from '../../../../utils/src/snowflake';
import { temp } from '../../../../utils/src/temp';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export class Ready implements WSEvent<'READY'> {
  public on = 'READY' as const;

  public async invoke(ws: WS, client: Socket) {
    const user = {
      id: snowflake.generate(),
      avatarURL: '',
      username: fakerStatic.hacker.noun(),
    };
    temp.users.push(user);

    ws.server.emit('READY', user as Args.Ready);
  }
}