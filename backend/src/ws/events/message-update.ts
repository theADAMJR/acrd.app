import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Message } from '../../data/models/message';
import { WSEvent } from './ws-event';
import { Guild } from '../../data/models/guild';

export default class MessageDelete implements WSEvent<'MESSAGE_UPDATE'> {
  public on = 'MESSAGE_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { messageId, payload }: WSPayload.MessageUpdate) {
    const userId = sessions.get(client.id);
    const message = await Message.findById(messageId);
    if (!message)
      throw new TypeError('Message not found');

    // validate is message author, or guild owner
    const guild = await Guild.findOne({ channels: message.channelId as any });
    if (!guild)
      throw new TypeError('Guild not found');

    const canManage = guild.ownerId === userId
      || message.authorId === userId;
    if (!canManage)
      throw new TypeError('You cannot manage this message');
    
    payload = {
      content: payload.content,
    };
    await message.updateOne(payload);

    io.to(message.channelId)
      .emit('MESSAGE_UPDATE', { payload, messageId } as WSResponse.MessageUpdate);
  }
}