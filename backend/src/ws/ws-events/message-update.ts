import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'MESSAGE_UPDATE'> {
  on = 'MESSAGE_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { messageId, content, embed }: WS.Params.MessageUpdate) {
    const message = await deps.messages.get(messageId);
    deps.wsGuard.validateIsUser(client, message.authorId);
    
    if (content) message.content = content;
    message.updatedAt = new Date();
    await message.save();

    return [{
      emit: this.on,
      to: [message.channelId],
      send: { message },
    }];
  }
}
