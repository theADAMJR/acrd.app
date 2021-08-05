import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { User } from '../../data/models/user';

export default class implements WSEvent<'USER_UPDATE'> {
  public on = 'USER_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { payload }: WSPayload.UserUpdate) {
    const userId = sessions.get(client.id);
    const user = (await User.findById(userId))!;

    // validate username is available
    const discriminator = await User.countDocuments({ username: payload.username });
    if (discriminator >= 9999)
      throw new TypeError('Username is not available');

    await user.updateOne({
      avatarURL: payload.avatarURL,
      discriminator, 
      username: payload.username,
    });

    io.to(user.guildIds)
      .emit('USER_UPDATE', { userId, payload } as WSResponse.UserUpdate);
  }
}