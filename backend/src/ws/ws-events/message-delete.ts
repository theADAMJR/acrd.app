import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import Messages from '../../data/messages';
import { Message } from '../../data/models/message';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'MESSAGE_DELETE'> {
  on = 'MESSAGE_DELETE' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guard = Deps.get<WSGuard>(WSGuard),
    private messages = Deps.get<Messages>(Messages),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { messageId }: WS.Params.MessageDelete) {
    const message = await this.messages.get(messageId);
    const channel = await this.channels.get(message.channelId);

    try {
      this.guard.validateIsUser(client, message.authorId);
    } catch {
      await this.guard.validateCan(client, channel.guildId, PermissionTypes.Text.MANAGE_MESSAGES);
    }
    await message.deleteOne();

    if (message.id === channel.lastMessageId) {
      const previousMessage = await Message.findOne({ channelId: channel.id });
      channel.lastMessageId = previousMessage?.id;
      await (channel as any).save();
    }

    ws.io
      .to(message.channelId)
      .emit('MESSAGE_DELETE', {
        channelId: message.channelId,
        messageId: messageId,
      } as WS.Args.MessageDelete);
  }
}
