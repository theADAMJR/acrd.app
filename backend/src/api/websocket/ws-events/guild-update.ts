import { Socket } from 'socket.io';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import Guilds from '../../../data/guilds';
import { PermissionTypes } from '../../../types/permission-types';
import { PartialEntity, WS } from '../../../types/ws';

export default class implements WSEvent<'GUILD_UPDATE'> {
  on = 'GUILD_UPDATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private guilds = Deps.get<Guilds>(Guilds),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, name, iconURL }: WS.Params.GuildUpdate) { 
    await this.guard.validateCan(client, guildId, PermissionTypes.General.MANAGE_GUILD);

    const partialGuild = { name, iconURL };
    this.guard.validateKeys('guild', partialGuild);

    const guild = await this.guilds.get(guildId);
    this.validateChannels(guild, partialGuild);
    this.validateRoles(guild, partialGuild);

    if (iconURL) guild.iconURL = iconURL;
    if (name) guild.name = name;

    await guild.save();

    ws.io
      .to(guildId)
      .emit('GUILD_UPDATE', { guildId, partialGuild } as WS.Args.GuildUpdate);
  }

  private validateChannels(guild: Entity.Guild, partialGuild: PartialEntity.Guild) {
    if (!partialGuild.channels) return;
    if (guild.channels.length !== partialGuild.channels.length)
      throw new TypeError('Cannot add or remove channels this way');
  }

  private validateRoles(guild: Entity.Guild, partialGuild: PartialEntity.Guild) {
    if (!partialGuild.roles) return;
    if (guild.roles.length !== partialGuild.roles.length)
      throw new TypeError('Cannot add or remove roles this way');

    const oldEveryoneRoleId = guild.roles[0].id;
    const newEveryoneRoleId: string = partialGuild?.roles?.[0] as any;

    if (oldEveryoneRoleId !== newEveryoneRoleId)
      throw new TypeError('You cannot reorder the @everyone role');
  }
}
