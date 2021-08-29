import { Socket } from 'socket.io';
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

  public async invoke(ws: WebSocket, client: Socket, { roleId, guildId, name, color, permissions }: WS.Params.GuildRoleUpdate) {
    await this.guard.validateCan(client, guildId, 'MANAGE_ROLES');
    
    const partialRole = { name, color, permissions };
    await Role.updateOne(
      { _id: roleId },
      partialRole, 
      { runValidators: true },
    );

    ws.io
      .to(guildId)
      .emit('GUILD_ROLE_UPDATE', { guildId, partialRole } as WS.Args.GuildRoleUpdate);
  }
}