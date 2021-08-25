import { Socket } from 'socket.io';
import Invites from '../../data/invites';
import { Guild } from '../../data/models/guild';
import { PermissionTypes } from '../../types/permission-types';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'INVITE_DELETE'> {
  on = 'INVITE_DELETE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private invites = Deps.get<Invites>(Invites),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { inviteCode }: WS.Params.InviteDelete) {
    const invite = await this.invites.get(inviteCode);
    await this.guard.validateCan(client, invite.guildId, PermissionTypes.General.MANAGE_GUILD);

    await invite.deleteOne();

    ws.io
      .to(invite.guildId)
      .emit('INVITE_DELETE', {
        guildId: invite.guildId,
        inviteCode,
      } as WS.Args.InviteDelete);
  }
}