import { Socket } from 'socket.io';
import Users from '../../data/users';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'USER_UPDATE'> {
  on = 'USER_UPDATE' as const;

  constructor(
    private users = Deps.get<Users>(Users),
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { token, username, avatarURL, ignored, email }: WS.Params.UserUpdate) {
    const { id: userId } = await this.guard.decodeKey(token);
    const user = await this.users.getSelf(userId);

    const partialUser = {};
    if (email) partialUser['email'] = email;
    if (avatarURL) partialUser['avatarURL'] = avatarURL;
    if (ignored) partialUser['ignored'] = ignored;
    if (username) partialUser['username'] = username;
    const usernameChanged = username && username !== user.username;
    if (usernameChanged)
      partialUser['discriminator'] = await this.users.getDiscriminator(username);

    Object.assign(user, partialUser);
    await user.save();

    client.emit('USER_UPDATE', { userId, partialUser } as WS.Args.UserUpdate);
  }
}
