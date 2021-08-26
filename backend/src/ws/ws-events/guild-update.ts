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
    private guard = Deps.get<WSGuard>(WSGuard),
    private guilds = Deps.get<Guilds>(Guilds),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, name, iconURL }: WS.Params.GuildUpdate) { 
    await this.guard.validateCan(client, guildId, 'MANAGE_GUILD');

    const partialGuild = { name, iconURL };
    this.guard.validateKeys('guild', partialGuild);

    const guild = await this.guilds.get(guildId);

    if (iconURL) guild.iconURL = iconURL;
    if (name) guild.name = name;

    await guild.save();

    ws.io
      .to(guildId)
      .emit('GUILD_UPDATE', { guildId, partialGuild } as WS.Args.GuildUpdate);
  }
}
