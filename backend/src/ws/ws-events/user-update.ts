import { Entity, WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'USER_UPDATE'> {
  on = 'USER_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { token, username, avatarURL, ignored, email, activeThemeId }: WS.Params.UserUpdate) {
    const { id: userId } = await deps.wsGuard.decodeKey(token);
    const user = await deps.users.getSelf(userId);

    const partial: Partial<Entity.User> = {};
    const hasChanged = (key: string, value: any) => value && user[key] !== value;

    if (hasChanged('activeThemeId', activeThemeId)) partial['activeThemeId'] = activeThemeId;
    if (hasChanged('avatarURL', avatarURL)) partial['avatarURL'] = avatarURL;
    if (hasChanged('ignored', ignored)) partial['ignored'] = ignored;
    if (hasChanged('username', username)) {
      partial['username'] = username;
      partial['discriminator'] = await deps.users.getDiscriminator(username!);
    }
    if (hasChanged('email', email)) {
      partial['email'] = email;
      user['email'] = email!;

      await user.validate();
      await deps.emailFunctions.verifyEmail(email!, user);
    }

    Object.assign(user, partial);
    await user.save();

    return [{
      emit: this.on,
      to: [client.id],
      send: { userId, partialUser: partial },
    }];
  }
}
