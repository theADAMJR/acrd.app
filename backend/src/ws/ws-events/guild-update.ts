import { Socket } from 'socket.io';

import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Guilds from '../../data/guilds';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';

export default class implements WSEvent<'GUILD_UPDATE'> {
  on = 'GUILD_UPDATE' as const;

  public async invoke(ws: WebSocket, client: Socket, { guildId, name, iconURL }: WS.Params.GuildUpdate) { 
    await deps.wsGuard.validateCan(client, guildId, 'MANAGE_GUILD');

    const guild = await deps.guilds.get(guildId);
    const partial: Partial<Entity.Guild> = {};
    const hasChanged = (key: string, value: any) => value && guild[key] !== value;

    if (hasChanged('iconURL', iconURL)) partial.iconURL = iconURL;
    if (hasChanged('name', name)) partial.name = name!;

    Object.assign(guild, partial);
    await guild.save();

    ws.io
      .to(guildId)
      .emit('GUILD_UPDATE', { guildId, partialGuild: partial } as WS.Args.GuildUpdate);
  }
}
