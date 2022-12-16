import { WS } from '@acrd/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'INVITE_DELETE'> {
  on = 'INVITE_DELETE' as const;

  public async invoke(ws: WebSocket, client: Socket, { inviteCode }: WS.Params.InviteDelete) {
    const invite = await deps.invites.get(inviteCode);
    await deps.wsGuard.validateCan(client, invite.guildId, 'MANAGE_GUILD');

    await invite.deleteOne();

    return [{
      emit: this.on,
      to: [invite.guildId],
      send: { guildId: invite.guildId, inviteCode },
    }];
  }
}