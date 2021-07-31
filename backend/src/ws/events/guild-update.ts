import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/models/guild';
import { Channel } from '../../data/models/channel';
import { User } from '../../data/models/user';

export default class implements WSEvent<'GUILD_UPDATE'> {
  public on = 'GUILD_UPDATE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, params: WSPayload.GuildUpdate) {
    const userId = sessions.get(client.id);
    const guild = await Guild.findById(params.guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    if (guild.ownerId !== userId)
      throw new TypeError('Only the guild owner can do this');
    
    // update specific guild properties
    guild.name = params.name;
    guild.iconURL = params.iconURL;
    await guild.save();

    io.to(guild.id)
      .emit('GUILD_UPDATE', {
        guildId: params.guildId,
        partialGuild: {
          ...params,
          guildId: undefined,
        },
      } as WSResponse.GuildUpdate);
  }
}