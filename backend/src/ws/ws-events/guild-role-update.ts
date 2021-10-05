import { Socket } from 'socket.io';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { WS } from '../../types/ws';
import Roles from '../../data/roles';
import Guilds from '../../data/guilds';
import GuildMembers from '../../data/guild-members';

export default class implements WSEvent<'GUILD_ROLE_UPDATE'> {
  on = 'GUILD_ROLE_UPDATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private guilds = Deps.get<Guilds>(Guilds),
    private members = Deps.get<GuildMembers>(GuildMembers),
    private roles = Deps.get<Roles>(Roles),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { roleId, guildId, name, color, permissions, hoisted }: WS.Params.GuildRoleUpdate) {
    await this.guard.validateCan(client, guildId, 'MANAGE_ROLES');
    
    const userId = ws.sessions.get(client.id);
    const guild = await this.guilds.get(guildId);
    const selfMember = await this.members.getInGuild(guildId, userId);
    const isHigher = await this.roles.isHigher(guild, selfMember, [roleId]);
    if (!isHigher)
      throw new TypeError('You cannot manage this role');

    const everyoneRole = await this.roles.getEveryone(guildId);
    if (everyoneRole.id === roleId && name !== everyoneRole.name)
      throw new TypeError('You cannot change @everyone role name');
    if (everyoneRole.id === roleId && color !== everyoneRole.color)
      throw new TypeError('You cannot change @everyone role color');
    if (everyoneRole.id === roleId && hoisted)
      throw new TypeError('You cannot hoist @everyone role');
    
    // TODO: implement position 
    const partialRole = { name, color, permissions, hoisted };
    await this.roles.update(roleId, partialRole);

    ws.io
      .to(guildId)
      .emit('GUILD_ROLE_UPDATE', { guildId, roleId, partialRole } as WS.Args.GuildRoleUpdate);
  }
}