import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Message } from '../../data/models/message';
import { WSEvent } from './ws-event';
import { Guild } from '../../data/models/guild';

export default class MessageDelete implements WSEvent<'MESSAGE_DELETE'> {
  public on = 'MESSAGE_DELETE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: API.WSPayload.MessageDelete) {
    const message = await Message.findById(params.messageId);
    if (!message)
      throw new TypeError('Message not found');

    // validate guild owner, or message author
    const userId = sessions.get(client.id);
    const guild = await Guild.findOne({ channels: message.channelId as any });
    if (!guild)
      throw new TypeError('Guild not found');

    const canManage = guild.ownerId === userId
      || message.authorId === userId;
    if (!canManage)
      throw new TypeError('You cannot manage this message');

    await message.deleteOne();

    io.to(message.channelId)
      .emit('MESSAGE_DELETE', params as API.WSResponse.MessageDelete);
  }
}