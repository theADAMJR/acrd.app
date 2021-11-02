import { Socket } from 'socket.io';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Guilds from '../../data/guilds';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';

export default class implements WSEvent<'GUILD_UPDATE'> {
  on = 'GUILD_UPDATE' as const;

  constructor(
    private guard = deps.wsCooldowns,
    private guilds = deps.guilds,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, name, iconURL }: WS.Params.GuildUpdate) { 
    await this.guard.validateCan(client, guildId, 'MANAGE_GUILD');

    const guild = await this.guilds.get(guildId);
    const partial: Partial<Entity.Guild> = {};
    const hasChanged = (key: string, value: any) => value && guild[key] !== value;

    if (hasChanged('iconURL', iconURL)) guild.iconURL = iconURL;
    if (hasChanged('name', name)) guild.name = name!;

    Object.assign(guild, partial);
    await guild.save();

    ws.io
      .to(guildId)
      .emit('GUILD_UPDATE', { guildId, partialGuild: partial } as WS.Args.GuildUpdate);
  }
}
