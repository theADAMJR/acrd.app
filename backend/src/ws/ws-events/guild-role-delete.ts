import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';
import { GuildMember } from '../../data/models/guild-member';

export default class implements WSEvent<'GUILD_ROLE_DELETE'> {
  on = 'GUILD_ROLE_DELETE' as const;

  public async invoke(ws: WebSocket, client: Socket, { guildId, roleId }: WS.Params.GuildRoleDelete) {
    const role = await deps.roles.get(roleId);
    await deps.wsGuard.validateCan(client, guildId, 'MANAGE_ROLES');

    if (role.name === '@everyone')
      throw new TypeError('This role cannot be deleted');

    await role.deleteOne();

    // TODO: update other role positions
    await GuildMember.updateMany(
      { guildId },
      { $pull: { roleIds: roleId } },
      { runValidators: true },
    );

    return [{
      emit: this.on,
      to: [guildId],
      send: { guildId, roleId },
    }];
  }
}
