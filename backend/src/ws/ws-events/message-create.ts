import { Socket } from 'socket.io';
import { Message } from '../../data/models/message';
import { generateSnowflake } from '../../data/snowflake-entity';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import Messages from '../../data/messages';
import Pings from '../../data/pings';
import Channels from '../../data/channels';
import Users from '../../data/users';
import { Channel } from '../../data/models/channel';
import { User } from '../../data/models/user';
import { WS } from '../../types/ws';

export default class implements WSEvent<'MESSAGE_CREATE'> {
  on = 'MESSAGE_CREATE' as const;

  constructor(
    private messages = Deps.get<Messages>(Messages),
    private guard = Deps.get<WSGuard>(WSGuard),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId, content }: WS.Params.MessageCreate) {
    await this.guard.canAccessChannel(client, channelId, true);
      
    const authorId = ws.sessions.userId(client);
    const message = await this.messages.create(authorId, channelId, { content });

    await Channel.updateOne(
      { _id: channelId },
      { lastMessageId: message.id }
    );

    const user = await this.users.getSelf(authorId, false);
    user.lastReadMessageIds[channelId] = message.id;
    await user.save();

    ws.io
      .to(channelId)
      .emit('MESSAGE_CREATE', { message } as WS.Args.MessageCreate);
  }
}
