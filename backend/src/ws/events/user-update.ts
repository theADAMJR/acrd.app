import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/models/guild';
import { Channel } from '../../data/models/channel';
import { User } from '../../data/models/user';

export default class implements WSEvent<'USER_UPDATE'> {
  public on = 'USER_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: WSPayload.UserUpdate) {
    const userId = sessions.get(client.id);
    const user = (await User.findById(params.userId))!;

    user.avatarURL = params.avatarURL;
    user.username = params.username;

    io.to(user.guildIds)
      .emit('USER_UPDATE', {
        userId: params.userId,
        partialUser: {
          ...params,
          userId: undefined,
        },
      } as WSResponse.UserUpdate);
  }
}