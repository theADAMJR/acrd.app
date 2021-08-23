import { Socket } from 'socket.io';
import { PermissionTypes } from '../../../types/entity-types';
import { Guild } from '../../../data/models/guild';
import { Role } from '../../../data/models/role';
import { generateSnowflake } from '../../../data/snowflake-entity';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, Args, Params } from './ws-event';
import Roles from '../../../data/roles';

export default class implements WSEvent<'GUILD_ROLE_CREATE'> {
  on = 'GUILD_ROLE_CREATE' as const;

  constructor(
    private roles = Deps.get<Roles>(Roles),
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, partialRole }: Params.GuildRoleCreate) {
    await this.guard.validateCan(client, guildId, PermissionTypes.General.MANAGE_ROLES);
    
    const role = await this.roles.create(guildId, partialRole);
    await Guild.updateOne(
      { _id: guildId },
      { $push: { roles: role } },
      { runValidators: true },
    );

    ws.io
      .to(guildId)
      .emit('GUILD_ROLE_CREATE', { guildId, role } as Args.GuildRoleCreate);
  }
}
