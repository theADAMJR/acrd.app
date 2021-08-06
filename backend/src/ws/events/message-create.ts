import { Socket } from 'socket.io';
import { Message } from '../../data/models/message';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'MESSAGE_CREATE'> {
  public on = 'MESSAGE_CREATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: WSPayload.MessageCreate) {
    // >v6 -> ensure author has access to channel    
    const message = await Message.create({
      content: params.content,
      channelId: params.channelId,
      authorId: sessions.get(client.id) as string,
    });

    io.to(params.channelId)
      .emit('MESSAGE_CREATE', { message } as WSResponse.MessageCreate);
  }
}