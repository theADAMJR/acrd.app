import { Entity, WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'MESSAGE_UPDATE'> {
  public on = 'MESSAGE_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { messageId, content, embed }: WS.Params.MessageUpdate) {
    const message = await deps.messages.get(messageId);
    deps.wsGuard.validateIsUser(client, message.authorId);
    
    const partial: Partial<Entity.Message> = {};
    if (content) partial.content = content;
    partial.updatedAt = new Date();

    Object.assign(message, partial);
    await message.save();

    return [{
      emit: this.on,
      to: [message.channelId],
      send: { messageId, partialMessage: partial },
    }];
  }
}
