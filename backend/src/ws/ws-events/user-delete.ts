import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WS } from '../../types/ws';
import generateInvite from '../../data/utils/generate-invite';

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
    ws.io.emit('USER_UPDATE', { userId: user.id, partialUser } as WS.Args.UserUpdate);
    client.disconnect();
  }
}