import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { Channel, ChannelDocument } from '../../data/models/channel';
import { WS } from '../../types/ws';

// TODO: int. test
export default class implements WSEvent<'CHANNEL_UPDATE'> {
  on = 'CHANNEL_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { position, name, summary, overrides, channelId }: WS.Params.ChannelUpdate) {
    const channel = await deps.channels.get(channelId);
    await deps.wsGuard.validateCan(client, channel.guildId, 'MANAGE_CHANNELS');
    
    const partialChannel: Partial<Entity.Channel> = {};
    if (name) partialChannel.name = name;
    if (overrides) partialChannel.overrides = overrides;
    if (summary) partialChannel.summary = summary;
    // TODO: TESTME
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
    await Channel.updateMany({
      guildId: channel.guildId,
      position: { $gt: position },
    }, { $inc: { position: 1 } });
  }
}
