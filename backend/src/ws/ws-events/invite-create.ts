import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'INVITE_CREATE'> {
  on = 'INVITE_CREATE' as const;

  public async invoke(ws: WebSocket, client: Socket, params: WS.Params.InviteCreate) {
    await deps.wsGuard.validateCan(client, params.guildId, 'CREATE_INVITE');

    const invite = await deps.invites.create(params, ws.sessions.userId(client));

    ws.io
      .to(params.guildId)
      .emit('INVITE_CREATE', {
        guildId: params.guildId,
        invite,
      } as WS.Args.InviteCreate);
  }
}
