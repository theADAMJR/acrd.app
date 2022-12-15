import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { Channel, ChannelDocument } from '../../data/models/channel';
import { Entity, WS } from '@acrd/types';

export default class implements WSEvent<'CHANNEL_UPDATE'> {
  public on = 'CHANNEL_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { position, name, summary, overrides, channelId }: WS.Params.ChannelUpdate) {
    const channel = await deps.channels.get(channelId);
    await deps.wsGuard.validateCan(client, channel.guildId, 'MANAGE_CHANNELS');
    
    const partialChannel: Partial<Entity.Channel> = {};
    if (name) partialChannel.name = name;
    if (overrides) partialChannel.overrides = overrides;
    if (summary) partialChannel.summary = summary;
    if (position) {
      partialChannel.position = position;
      await this.raiseHigherChannels(position, channel);
    }

    Object.assign(channel, partialChannel);
    await channel.save();

    return [{
      emit: this.on,
      to: [channel.guildId],
      send: { channelId: channel.id, partialChannel },
    }];
  }
  
  private async raiseHigherChannels(position: number, channel: ChannelDocument) {
    await Channel.updateMany({
      guildId: channel.guildId,
      position: { $gt: position },
    }, { $inc: { position: 1 } });
  }
}
