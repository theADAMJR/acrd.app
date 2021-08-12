import { WSEvent } from './ws-event';
import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Guild } from '../../data/models/guild';
import { User } from '../../data/models/user';
import SessionManager from '../session-manager';

export default class implements WSEvent<'GUILD_DELETE'> {
  public on = 'GUILD_DELETE' as const;

  public async invoke(ws: WS, client: Socket, { guildId }: API.WSPayload.GuildDelete) {
    const userId = ws.sessions.get(client.id);
    const guild = await Guild.findById(guildId);
    if (!guild)
      throw new TypeError('Guild not found');

    if (guild.ownerId !== userId)
      throw new TypeError('Only the guild owner can do this');

    await guild.deleteOne();
    await this.updateMembers(ws, guild);

    client.emit('GUILD_DELETE', { guildId } as API.WSResponse.GuildDelete);
  }

  private async updateMembers({ sessions, io }: WS, guild: Entity.Guild) {
    // is it better to iterate User.findOne, or just use User.find once?
    const users = await User.find({ guildIds: guild.id });
    
    // tell connected guild members that they're no longer in that guild
    const clientIds = io.sockets.adapter.rooms.get(guild.id)!;
    for (const clientId of clientIds) {
      const client = io.sockets.sockets.get(clientId)!;
      const { guildIds } = users.find(u => u.id === sessions.get(clientId))!;

      const index = guildIds.indexOf(guild.id);
      guildIds.splice(index, 1);
      
      client.emit('USER_UPDATE', { payload: { guildIds } } as API.WSResponse.UserUpdate);
      client.leave(guild.id);    
    }
  }
}