import { Socket } from 'socket.io';
import Invites from '../../data/invites';
import { PermissionTypes } from '../../types/permission-types';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'INVITE_CREATE'> {
  on = 'INVITE_CREATE' as const;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private invites = Deps.get<Invites>(Invites),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, params: WS.Params.InviteCreate) {
    await this.guard.validateCan(client, params.guildId, 'CREATE_INVITE');

    const invite = await this.invites.create(params, ws.sessions.userId(client));

    ws.io
      .to(params.guildId)
      .emit('INVITE_CREATE', {
        guildId: params.guildId,
        invite,
      } as WS.Args.InviteCreate);
  }
}
