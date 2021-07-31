import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { User } from '../../data/models/user';

export default class implements WSEvent<'CHANNEL_CREATE'> {
  public on = 'CHANNEL_CREATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: WSPayload.ChannelCreate) {
    const userId = sessions.get(client.id);
    const user = (await User.findById(params.userId))!;

    user.avatarURL = params.avatarURL;
    user.username = params.username;

    io.to(user.guildIds)
      .emit('CHANNEL_CREATE', {
        userId: params.userId,
        partialUser: {
          ...params,
          userId: undefined,
        },
      } as WSResponse.ChannelCreate);
  }
}