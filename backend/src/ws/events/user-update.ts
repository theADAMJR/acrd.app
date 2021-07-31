import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { User } from '../../data/models/user';

export default class implements WSEvent<'USER_UPDATE'> {
  public on = 'USER_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { payload }: WSPayload.UserUpdate) {
    const userId = sessions.get(client.id);
    const user = (await User.findById(userId))!;
    const partialUser = {
      avatarURL: payload.avatarURL,
      username: payload.username,
    };
    await user.updateOne(partialUser);

    io.to(user.guildIds)
      .emit('USER_UPDATE', { userId, payload } as WSResponse.UserUpdate);
  }
}