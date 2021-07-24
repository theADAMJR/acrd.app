import { Socket } from 'socket.io';
import { User } from '../../data/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';
import faker from 'faker';

export default class Ready implements WSEvent<'READY'> {
  public on = 'READY' as const;

  public async invoke(ws: WS, client: Socket) {    
    const user = await User.create({
      avatarURL: '',
      username: faker.hacker.noun(),
    });

    client.emit('READY', user as Args.Ready);
  }
}