import { Socket } from 'socket.io';
import { PermissionTypes } from '../../types/permission-types';
import { Role } from '../../data/models/role';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { WS } from '../../types/ws';

export default class implements WSEvent<'GUILD_ROLE_UPDATE'> {
  on = 'GUILD_ROLE_UPDATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { roleId, partialRole, guildId }: WS.Params.GuildRoleUpdate) {
    await this.guard.validateCan(client, guildId, PermissionTypes.General.MANAGE_ROLES);
    this.guard.validateKeys('role', partialRole);

    await Role.updateOne(
      { _id: roleId },
      partialRole as any, 
      { runValidators: true },
    );

    ws.io
      .to(guildId)
      .emit('GUILD_ROLE_UPDATE', { guildId, partialRole } as WS.Args.GuildRoleUpdate);
  }
}