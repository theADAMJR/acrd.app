import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/models/guild';
import { Channel } from '../../data/models/channel';
import { User } from '../../data/models/user';

export default class implements WSEvent<'GUILD_DELETE'> {
  public on = 'GUILD_DELETE' as const;

  public async invoke({ sessions }: WS, client: Socket, { guildId }: WSPayload.GuildDelete) {
    const userId = sessions.get(client.id);
    const guild = await Guild.findById(guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    if (guild.ownerId !== userId)
      throw new TypeError('Only the guild owner can do this');

    await guild.deleteOne();

    client.emit('GUILD_DELETE', { guildId } as WSResponse.GuildDelete);
  }
}