import { Socket } from 'socket.io';
import { User } from '../../data/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export class Ready implements WSEvent<'READY'> {
  public on = 'READY' as const;

  public async invoke(ws: WS, client: Socket) {
    const user = await User.create({
      avatarURL: '',
      username: fakerStatic.hacker.noun(),
    });

    ws.server.emit('READY', user as Args.Ready);
  }
}