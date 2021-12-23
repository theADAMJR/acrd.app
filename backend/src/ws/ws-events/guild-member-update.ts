import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_UPDATE'> {
  public on = 'GUILD_MEMBER_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { memberId, roleIds }: WS.Params.GuildMemberUpdate) {
    const managedMember = await deps.guildMembers.get(memberId);

    const selfUserId = ws.sessions.userId(client);
    const selfMember = await deps.guildMembers.getInGuild(managedMember.guildId, selfUserId);

    await deps.wsGuard.validateCan(client, selfMember.guildId, 'MANAGE_ROLES');

    const guild = await deps.guilds.get(managedMember.guildId);
    const selfHasHigherRoles = await deps.roles.memberIsHigher(guild, selfMember, managedMember.roleIds.concat(roleIds!));

    const isSelf = selfMember.id === memberId;
    const selfIsOwner = selfMember.userId === guild.ownerId;
    if (!isSelf && !selfHasHigherRoles && !selfIsOwner)
      throw new TypeError('Member has higher roles'); 
    
    const everyoneRole = await deps.roles.getEveryone(guild.id);
    const partialMember = {
      roleIds: [everyoneRole.id].concat(roleIds ?? []),
    };
    await deps.guildMembers.update(managedMember.id, partialMember);
    
    return [{
      emit: this.on,
      to: [managedMember.guildId],
      send: {
        guildId: managedMember.guildId,
        memberId,
        partialMember,
      },
    }];
  }
}
