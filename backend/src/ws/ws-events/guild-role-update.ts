import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_ROLE_UPDATE'> {
  public on = 'GUILD_ROLE_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { roleId, guildId, name, color, permissions, hoisted }: WS.Params.GuildRoleUpdate) {
    await deps.wsGuard.validateCan(client, guildId, 'MANAGE_ROLES');
    
    const userId = ws.sessions.get(client.id);
    const guild = await deps.guilds.get(guildId);
    const selfMember = await deps.guildMembers.getInGuild(guildId, userId);
    const isHigher = await deps.roles.memberIsHigher(guild, selfMember, [roleId]);
    if (!isHigher)
      throw new TypeError('You cannot manage this role');

    const everyoneRole = await deps.roles.getEveryone(guildId);
    if (everyoneRole.id === roleId && name !== everyoneRole.name)
      throw new TypeError('You cannot change @everyone role name');
    if (everyoneRole.id === roleId && color !== everyoneRole.color)
      throw new TypeError('You cannot change @everyone role color');
    if (everyoneRole.id === roleId && hoisted)
      throw new TypeError('You cannot hoist @everyone role');
    
    // TODO: implement position 
    const partialRole = { name, color, permissions, hoisted };
    await deps.roles.update(roleId, partialRole);

    return [{
      emit: this.on,
      to: [guildId],
      send: { guildId, roleId, partialRole },
    }];
  }
}