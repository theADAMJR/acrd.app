import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { WSGuard } from '../modules/ws-guard';
import { WS } from '../../types/ws';
import { promisify } from 'util';
import { stat } from 'fs';
import { resolve } from 'path';

const statAsync = promisify(stat);

export default class implements WSEvent<'MESSAGE_CREATE'> {
  on = 'MESSAGE_CREATE' as const;

  constructor(
    private messages = deps.messages,
    private guard = deps.wsGuard,
    private users = deps.users,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { attachmentIds, channelId, content, embed }: WS.Params.MessageCreate) {
    const authorId = ws.sessions.userId(client);
    
    const [_, message, author] = await Promise.all([
      this.guard.validateCanInChannel(client, channelId, 'SEND_MESSAGES'), 
      this.messages.create(authorId, channelId, { attachmentIds, content, embed }),
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