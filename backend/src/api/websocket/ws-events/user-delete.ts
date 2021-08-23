import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { User } from '../../../data/models/user';
import { WebSocket } from '../websocket';
import { generateInvite } from '../../../data/models/invite';
import { WS } from '../../../types/ws';

export default class implements WSEvent<'USER_DELETE'> {
  public on = 'USER_DELETE' as const;

  public async invoke({ io, sessions }: WebSocket, client: Socket) {
    const userId = sessions.get(client.id);

    const user = (await User.findById({ _id: userId }))!;
    const payload = {
      discriminator: 0,
      username: `Deleted User ${generateInvite(6)}`,
    };
    await user.updateOne(payload);
  
    client.emit('USER_DELETE');

    io.to(user.guilds as string[])
      .emit('USER_UPDATE', { userId, payload } as WS.From.UserUpdate);

    client.disconnect();
  }
}