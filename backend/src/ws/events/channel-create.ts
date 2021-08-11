import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Channel } from '../../data/models/channel';
import { Guild } from '../../data/models/guild';

export default class implements WSEvent<'CHANNEL_CREATE'> {
  public on = 'CHANNEL_CREATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: API.WSPayload.ChannelCreate) {
    const userId = sessions.get(client.id);
    const guild = await Guild.findById(params.guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    if (guild.ownerId !== userId)
      throw new TypeError('Only the guild owner can do this');

    // actually create channel
    const channel = await Channel.create({
      guildId: params.guildId,
      name: params.name,
    });

    // add channel to guild
    guild.channels.push(channel);
    await guild.save();

    // join all sockets to channel, when created
    const connectedClients = await io.in(guild.id).fetchSockets();
    for (const client of connectedClients)
      client.join(channel.id);

    io.to(guild.id)
      .emit('CHANNEL_CREATE', { channel, creatorId: userId } as API.WSResponse.ChannelCreate);
  }
}