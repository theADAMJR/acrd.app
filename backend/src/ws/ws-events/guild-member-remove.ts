import { Socket } from 'socket.io';
import Guilds from '../../data/guilds';
import { Channel } from '../../data/models/channel';
import { Guild, GuildDocument } from '../../data/models/guild';
import { GuildMember } from '../../data/models/guild-member';
import { User } from '../../data/models/user';
import Users from '../../data/users';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_REMOVE'> {
  on = 'GUILD_MEMBER_REMOVE' as const;

  constructor(
    private guilds = deps.guilds,
    private guard = deps.wsCooldowns,
    private users = deps.users,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, userId }: WS.Params.GuildMemberRemove) {
    const guild = await this.guilds.get(guildId);
    const members = await this.guilds.getMembers(guildId);
    const member = members.find(m => m.userId === userId);    
    if (!member)
      throw new TypeError('Member does not exist');

    const selfUserId = ws.sessions.get(client.id);
    if (guild.ownerId === member.userId)
      throw new TypeError('You cannot leave a guild you own');
      
    else if (selfUserId !== member.userId)
      await this.guard.validateCan(client, guildId, 'KICK_MEMBERS');

    // TODO: validate user is higher before kicking them
      
    const user = await this.users.getSelf(member.userId);
    const index = user.guildIds.indexOf(guildId);
    user.guildIds.splice(index, 1);
    await user.save();

    await GuildMember.deleteOne({ guildId, userId });

    const kickedClientId = ws.sessions.getClientIdFromUserId(userId);
    if (kickedClientId) {
      const memberClient = ws.io.sockets.sockets.get(kickedClientId);
      memberClient?.emit('GUILD_DELETE', { guildId } as WS.Args.GuildDelete);
      await client.leave(guildId);
    }

    ws.io
      .to(guildId)
      .emit('GUILD_MEMBER_REMOVE', { memberId: member.id } as WS.Args.GuildMemberRemove);

    const userClient = ws.io.sockets.sockets.get(userId);
    if (userClient)
      await this.leaveGuildRooms(userClient, guild);
  }

  private async leaveGuildRooms(client: Socket, guild: GuildDocument) {
    await client.leave(guild.id);
    const guildChannels = await this.guilds.getChannels(guild.id);
    for (const channel of guildChannels)
      await client.leave(channel.id);
  }
}
