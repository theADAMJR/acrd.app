import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WS } from '../../types/ws';
import Users from '../../data/users';

import { WSGuard } from '../modules/ws-guard';
import generateInvite from '../../data/utils/generate-invite';

export default class implements WSEvent<'USER_DELETE'> {
  public on = 'USER_DELETE' as const;

  constructor(
    private users = deps.users,
    private guard = deps.wsGuard,
  ) { }

  public async invoke(ws: WebSocket, client: Socket, { token }: WS.Params.UserDelete) {
    const { id: userId } = await this.guard.decodeKey(token);
    const user = await this.users.getSelf(userId);

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