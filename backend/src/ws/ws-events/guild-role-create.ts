import { WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_ROLE_CREATE'> {
  public on = 'GUILD_ROLE_CREATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { guildId }: WS.Params.GuildRoleCreate) {
    await deps.wsGuard.validateCan(client, guildId, 'MANAGE_ROLES');
    
    const role = await deps.roles.create(guildId, { name: 'New Role' });

    return [{
      emit: this.on,
      to: [guildId],
      send: { guildId, role },
    }];
  }
}
