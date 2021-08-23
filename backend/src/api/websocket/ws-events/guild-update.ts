import { Socket } from 'socket.io';
import { Lean, PermissionTypes } from '../../../types/entity-types';
import { Partial } from '../../../data/types/ws-types';
import { Guild } from '../../../data/models/guild';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, Args, Params } from './ws-event';
import Guilds from '../../../data/guilds';

export default class implements WSEvent<'GUILD_UPDATE'> {
  on = 'GUILD_UPDATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private guilds = Deps.get<Guilds>(Guilds),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { guildId, partialGuild }: Params.GuildUpdate) { 
    await this.guard.validateCan(client, guildId, PermissionTypes.General.MANAGE_GUILD);

    this.guard.validateKeys('guild', partialGuild);

    const guild = await this.guilds.get(guildId);
    this.validateChannels(guild, partialGuild);
    this.validateRoles(guild, partialGuild);

    await Guild.updateOne(
      { _id: guildId },
      partialGuild as any,
      { runValidators: true },
    );

    ws.io
      .to(guildId)
      .emit('GUILD_UPDATE', { guildId, partialGuild } as Args.GuildUpdate);
  }

  private validateChannels(guild: Entity.Guild, partialGuild: Partial.Guild) {
    if (!partialGuild.channels) return;
    if (guild.channels.length !== partialGuild.channels.length)
      throw new TypeError('Cannot add or remove channels this way');
  }

  private validateRoles(guild: Entity.Guild, partialGuild: Partial.Guild) {
    if (!partialGuild.roles) return;
    if (guild.roles.length !== partialGuild.roles.length)
      throw new TypeError('Cannot add or remove roles this way');

    const oldEveryoneRoleId = guild.roles[0].id;
    const newEveryoneRoleId: string = partialGuild?.roles?.[0] as any;

    if (oldEveryoneRoleId !== newEveryoneRoleId)
      throw new TypeError('You cannot reorder the @everyone role');
  }
}
