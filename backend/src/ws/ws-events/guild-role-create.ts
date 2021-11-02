import { Socket } from 'socket.io';
import { PermissionTypes } from '../../types/permission-types';
import { Guild } from '../../data/models/guild';
import { Role } from '../../data/models/role';
import { generateSnowflake } from '../../data/snowflake-entity';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Roles from '../../data/roles';
import { WS } from '../../types/ws';

export default class implements WSEvent<'GUILD_ROLE_CREATE'> {
  on = 'GUILD_ROLE_CREATE' as const;

  constructor(
    private roles = deps.roles,
    private guard = deps.wsGuard,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId }: WS.Params.GuildRoleCreate) {
    await this.guard.validateCan(client, guildId, 'MANAGE_ROLES');
    
    const role = await this.roles.create(guildId, { name: 'New Role' });

    ws.io
      .to(guildId)
      .emit('GUILD_ROLE_CREATE', { guildId, role } as WS.Args.GuildRoleCreate);
  }
}
