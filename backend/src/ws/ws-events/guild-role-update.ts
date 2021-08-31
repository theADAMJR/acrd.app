import { Socket } from 'socket.io';
import { Role } from '../../data/models/role';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { WS } from '../../types/ws';
import Roles from '../../data/roles';

export default class implements WSEvent<'GUILD_ROLE_UPDATE'> {
  on = 'GUILD_ROLE_UPDATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private roles = Deps.get<Roles>(Roles),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { roleId, guildId, name, color, permissions, hoisted }: WS.Params.GuildRoleUpdate) {
    await this.guard.validateCan(client, guildId, 'MANAGE_ROLES');    

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