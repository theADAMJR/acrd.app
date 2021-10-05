import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import Messages from '../../data/messages';
import Users from '../../data/users';
import { Channel } from '../../data/models/channel';
import { WS } from '../../types/ws';

export default class implements WSEvent<'MESSAGE_CREATE'> {
  on = 'MESSAGE_CREATE' as const;

  constructor(
    private messages = Deps.get<Messages>(Messages),
    private guard = Deps.get<WSGuard>(WSGuard),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId, content, embed }: WS.Params.MessageCreate) {
    const authorId = ws.sessions.userId(client);
    
    const [_, message, author] = await Promise.all([
      this.guard.validateCanInChannel(client, channelId, 'SEND_MESSAGES'), 
      this.messages.create(authorId, channelId, { content, embed }),
      this.users.getSelf(authorId),
    ]);

    author.lastReadMessageIds ??= {};
    author.lastReadMessageIds[channelId] = message.id;
    await author.save();

    await Channel.updateOne({ _id: channelId }, { lastMessageId: message.id }),

    ws.io
      .to(channelId)
      .emit('MESSAGE_CREATE', { message } as WS.Args.MessageCreate);
  }
}