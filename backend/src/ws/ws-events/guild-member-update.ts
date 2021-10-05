import { Socket } from 'socket.io';
import GuildMembers from '../../data/guild-members';
import Guilds from '../../data/guilds';
import Roles from '../../data/roles';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_UPDATE'> {
  on = 'GUILD_MEMBER_UPDATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private guilds = Deps.get<Guilds>(Guilds),
    private members = Deps.get<GuildMembers>(GuildMembers),
    private roles = Deps.get<Roles>(Roles),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { memberId, roleIds }: WS.Params.GuildMemberUpdate) {
    const managedMember = await this.members.get(memberId);

    const selfUserId = ws.sessions.userId(client);
    const selfMember = await this.members.getInGuild(managedMember.guildId, selfUserId);

    await this.guard.validateCan(client, selfMember.guildId, 'MANAGE_ROLES');
    
    const guild = await this.guilds.get(managedMember.guildId);
    const selfHasHigherRoles = await this.roles.memberIsHigher(guild, selfMember, managedMember.roleIds);
    
    const isSelf = selfMember.id === memberId;
    const selfIsOwner = selfMember.userId === guild.ownerId;
    if (!isSelf && !selfHasHigherRoles && !selfIsOwner)
      throw new TypeError('Member has higher roles'); 
    
    const everyoneRole = await this.roles.getEveryone(guild.id);
    const partialMember = {
      roleIds: [everyoneRole.id].concat(roleIds ?? []),
    };
    await this.members.update(managedMember.id, partialMember);
    
    ws.io
      .to(managedMember.guildId)
      .emit('GUILD_MEMBER_UPDATE', {
        guildId: managedMember.guildId,
        memberId,
        partialMember,
      } as WS.Args.GuildMemberUpdate);
  }
}
