import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { User } from '../../data/models/user';
import { generateInvite } from '../../utils/invite';
import uuid from 'uuid';

export default class implements WSEvent<'USER_DELETE'> {
  public on = 'USER_DELETE' as const;

  public async invoke({ io, sessions }: WS, client: Socket) {
    const userId = sessions.get(client.id);

    const user = (await User.findById({ _id: userId }))!;
    const payload = {
      username: `Deleted User ${generateInvite(6)}`,
    };
    (user as any).setPassword(uuid.v4());
    delete (user as any).salt;
    await user.updateOne(payload);

    io.to(user.guildIds)
      .emit('USER_UPDATE', { userId, payload } as WSResponse.UserUpdate);
  }
}