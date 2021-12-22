import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { Message } from '../../data/models/message';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'MESSAGE_DELETE'> {
  on = 'MESSAGE_DELETE' as const;

  public async invoke(ws: WebSocket, client: Socket, { messageId }: WS.Params.MessageDelete) {
    const message = await deps.messages.get(messageId);
    const channel = await deps.channels.get(message.channelId);

    try {
      deps.wsGuard.validateIsUser(client, message.authorId);
    } catch {
      await deps.wsGuard.validateCanInChannel(client, channel.id, 'MANAGE_MESSAGES');
    }
    await message.deleteOne();

    if (message.id === channel.lastMessageId) {
      const channelMsgs = await Message.find({ channelId: channel.id }).lean();
      const newLastMessage = channelMsgs[channelMsgs.length - 1];
      channel.lastMessageId = newLastMessage?.id;
      await channel.save();
    }

    return [{
      emit: this.on,
      to: [message.channelId],
      send: { channelId: message.channelId, messageId },
    }];
  }
}
