import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { User } from '../../data/models/user';

export default class implements WSEvent<'USER_DELETE'> {
  public on = 'USER_DELETE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: WSPayload.UserDelete) {
    const userId = sessions.get(client.id);
    const user = await User.findByIdAndDelete({ _id: userId });

    io.to(user.guildIds)
      .emit('USER_DELETE', { userId } as WSResponse.UserDelete);
  }
}