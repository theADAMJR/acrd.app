import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Channel } from '../../data/models/channel';
import { Guild } from '../../data/models/guild';

export default class implements WSEvent<'CHANNEL_DELETE'> {
  public on = 'CHANNEL_DELETE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { channelId, guildId }: API.WSPayload.ChannelDelete) {
    const userId = sessions.get(client.id);
    const guild = await Guild.findById(guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    if (guild.ownerId !== userId)
      throw new TypeError('Only the guild owner can do this');

    await Channel.deleteOne({ _id: channelId });

    io.to(guild.id)
      .emit('CHANNEL_DELETE', { channelId, guildId } as API.WSResponse.ChannelDelete);
  }
}