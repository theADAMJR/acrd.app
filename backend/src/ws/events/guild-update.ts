import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/models/guild';

export default class implements WSEvent<'GUILD_UPDATE'> {
  public on = 'GUILD_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: WSPayload.GuildUpdate) {
    const userId = sessions.get(client.id);
    const guild = await Guild.findById(params.guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    if (guild.ownerId !== userId)
      throw new TypeError('Only the guild owner can do this');

    const partialGuild = {
      name: params.name,
      iconURL: params.iconURL,
    };
    await guild.updateOne(partialGuild);

    io.to(guild.id)
      .emit('GUILD_UPDATE', { guildId: guild.id, partialGuild } as WSResponse.GuildUpdate);
  }
}