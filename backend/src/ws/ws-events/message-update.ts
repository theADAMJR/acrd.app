import { Socket } from 'socket.io';
import { MessageDocument } from '../../data/models/message';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import got from 'got';

import { WSGuard } from '../modules/ws-guard';
import Messages from '../../data/messages';


export default class implements WSEvent<'MESSAGE_UPDATE'> {
  on = 'MESSAGE_UPDATE' as const;

  constructor(
    private guard = deps.wsGuard,
    private messages = deps.messages,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { messageId, content, embed }: WS.Params.MessageUpdate) {
    const message = await this.messages.get(messageId);
    this.guard.validateIsUser(client, message.authorId);
    
    if (content) message.content = content;
    message.updatedAt = new Date();
    await message.save();

    ws.to(message.channelId)
      .emit('MESSAGE_UPDATE', { message });
  }
}
