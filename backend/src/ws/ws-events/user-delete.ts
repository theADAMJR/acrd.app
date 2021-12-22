import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import generateInvite from '../../data/utils/generate-invite';
import { WS } from '@accord/types';

export default class implements WSEvent<'USER_DELETE'> {
  public on = 'USER_DELETE' as const;

  public async invoke(ws: WebSocket, client: Socket, { token }: WS.Params.UserDelete) {
    const { id: userId } = await deps.wsGuard.decodeKey(token);
    const user = await deps.users.getSelf(userId);

    const partialUser = {
      discriminator: 0,
      locked: true,
      username: `Deleted User ${generateInvite(6)}`,
    };
    await user.updateOne(partialUser);

    client.emit('USER_DELETE');

    return [{
      emit: this.on,
      to: [userId],
      send: { userId: user.id, partialUser },
    }];
  }
}