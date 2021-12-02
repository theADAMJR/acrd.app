import { Socket } from 'socket.io';
import { PermissionTypes } from '@accord/types/permission-types';
import { Role } from '../../data/models/role';

import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { GuildMember } from '../../data/models/guild-member';

import Roles from '../../data/roles';

export default class implements WSEvent<'GUILD_ROLE_DELETE'> {
  on = 'GUILD_ROLE_DELETE' as const;

  constructor(
    private guard = deps.wsGuard,
    private roles = deps.roles,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, roleId }: WS.Params.GuildRoleDelete) {
    const role = await this.roles.get(roleId);
    await this.guard.validateCan(client, guildId, 'MANAGE_ROLES');

    if (role.name === '@everyone')
      throw new TypeError('This role cannot be deleted');

    await role.deleteOne();

    // TODO: update other role positions
    await GuildMember.updateMany(
      { guildId },
      { $pull: { roleIds: roleId } },
      { runValidators: true },
    );

    ws.io
      .to(guildId)
      .emit('GUILD_ROLE_DELETE', { guildId, roleId } as WS.Args.GuildRoleDelete);
  }
}
