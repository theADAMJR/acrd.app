import { Socket } from 'socket.io';

import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Channels from '../../data/channels';
import { WS } from '../../types/ws';
import { Channel, ChannelDocument } from '../../data/models/channel';

// TODO: int. test
export default class implements WSEvent<'CHANNEL_UPDATE'> {
  on = 'CHANNEL_UPDATE' as const;

  constructor(
    private channels = deps.channels,
    private guard = deps.wsGuard,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { position, name, summary, overrides, channelId }: WS.Params.ChannelUpdate) {
    const channel = await this.channels.get(channelId);
    await this.guard.validateCan(client, channel.guildId, 'MANAGE_CHANNELS');
    
    const partialChannel: Partial<Entity.Channel> = {};
    if (name) partialChannel.name = name;
    if (overrides) partialChannel.overrides = overrides;
    if (summary) partialChannel.summary = summary;
    // TODO: testme
    if (position) {
      partialChannel.position = position;
      await this.raiseHigherChannels(position, channel);
    }

    Object.assign(channel, partialChannel);
    await channel.save();

    ws.io
      .to(channel.guildId)
      .emit('CHANNEL_UPDATE', { channelId: channel.id, partialChannel } as WS.Args.ChannelUpdate);
  }
  
  private async raiseHigherChannels(position: number, channel: ChannelDocument) {
    const channels = await Channel.find({
      guildId: channel.guildId,
      position: { $gt: position },
    });
    for (const channel of channels) {
      channel.position++;
      await channel.save();
    }
  }
}
