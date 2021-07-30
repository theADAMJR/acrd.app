import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Message } from '../../data/message';
import { WSEvent } from './ws-event';

export default class MessageDelete implements WSEvent<'MESSAGE_DELETE'> {
  public on = 'MESSAGE_DELETE' as const;

  public async invoke({ io }: WS, client: Socket, params: WSPayload.MessageDelete) {
    const message = await Message.findById(params.messageId);
    if (!message)
      throw new TypeError('Message not found');
    await message.deleteOne();

    io.to(message.channelId)
      .emit('MESSAGE_DELETE', params as WSResponse.MessageDelete);
  }
}