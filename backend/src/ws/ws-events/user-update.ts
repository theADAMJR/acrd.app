import { Socket } from 'socket.io';
import Users from '../../data/users';
import { EmailFunctions } from '../../email/email-functions';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'USER_UPDATE'> {
  on = 'USER_UPDATE' as const;

  constructor(
    private users = Deps.get<Users>(Users),
    private guard = Deps.get<WSGuard>(WSGuard),
    private sendEmail = Deps.get<EmailFunctions>(EmailFunctions),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { token, username, avatarURL, ignored, email }: WS.Params.UserUpdate) {
    const { id: userId } = await this.guard.decodeKey(token);
    const user = await this.users.getSelf(userId);

    const partial: Partial<Entity.User> = {};
    const hasChanged = (key: string, value: any) => value && user[key] !== value;

    if (hasChanged('avatarURL', avatarURL)) partial['avatarURL'] = avatarURL;
    if (hasChanged('ignored', ignored)) partial['ignored'] = ignored;
    if (hasChanged('email', email)) {
      partial['email'] = email;
      await this.sendEmail.verifyEmail(email!, user);
    }
    if (hasChanged('username', username)) {
      partial['username'] = username;
      partial['discriminator'] = await this.users.getDiscriminator(username!);
    }

    Object.assign(user, partial);
    await user.save();

    client.emit('USER_UPDATE', { userId, partialUser: partial } as WS.Args.UserUpdate);
  }
}
