import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { User } from '../../data/models/user';

export default class implements WSEvent<'USER_UPDATE'> {
  public on = 'USER_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { payload }: API.WSPayload.UserUpdate) {
    const userId = sessions.get(client.id);
    const user = (await User.findById(userId))!;

    // validate username is available
    const discriminator = await User.countDocuments({ username: payload.username });
    if (discriminator >= 9999)
      throw new TypeError('Username is not available');

    const updated = {
      avatarURL: payload.avatarURL,
      discriminator: discriminator + 1, 
      email: payload.email, 
      username: payload.username,
    };
    await user.updateOne(updated, { runValidators: true });

    // discrim is also updated so we want to return it to client
    client.emit('USER_UPDATE', { userId, payload: updated } as API.WSResponse.UserUpdate);
  }
}