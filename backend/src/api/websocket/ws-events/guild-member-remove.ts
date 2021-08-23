import { Socket } from 'socket.io';
import Guilds from '../../../data/guilds';
import { GuildDocument } from '../../../data/models/guild';
import { GuildMember } from '../../../data/models/guild-member';
import { User } from '../../../data/models/user';
import { PermissionTypes } from '../../../types/entity-types';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, Args, Params } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_REMOVE'> {
  on = 'GUILD_MEMBER_REMOVE' as const;

  constructor(
    private guilds = Deps.get<Guilds>(Guilds),
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, memberId }: Params.GuildMemberRemove) {
    const guild = await this.guilds.get(guildId, true);
    const member = guild.members.find(m => m.id === memberId);    
    if (!member)
      throw new TypeError('Member does not exist');

    const selfUserId = ws.sessions.get(client.id);
    if (guild.ownerId === member.userId)
      throw new TypeError('You cannot leave a guild you own');
      
    else if (selfUserId !== member.userId)
      await this.guard.validateCan(client, guildId, PermissionTypes.General.KICK_MEMBERS);
      
    const user = await User.findById(member.userId) as any;
    const index = user.guilds.indexOf(guildId);
    user.guilds.splice(index, 1);
    await user.save();

    await GuildMember.deleteOne({ _id: memberId });

    await this.leaveGuildRooms(client, guild);

    ws.io
      .to(member.userId)
      .emit('GUILD_LEAVE', { guildId } as Args.GuildLeave);

    ws.io
      .to(guildId)
      .emit('GUILD_MEMBER_REMOVE', { guildId, memberId: member.id } as Args.GuildMemberRemove);
  }

  private async leaveGuildRooms(client: Socket, guild: GuildDocument) {
    await client.leave(guild.id);
    for (const channel of guild.channels)
      await client.leave(channel.id);
  }
}
