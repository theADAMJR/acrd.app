import { Socket } from 'socket.io';
import { User } from '../../../data/models/user';
import Users from '../../../data/users';
import { WS } from '../../../types/ws';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';
import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'READY'> {
  public on = 'READY' as const;
  public cooldown = 5;

  constructor(
    private guard = Deps.get<WSGuard>(WSGuard),
    private rooms = Deps.get<WSRooms>(WSRooms),
    private users = Deps.get<Users>(Users),
  ) { }

  public async invoke(ws: WebSocket, client: Socket, { token }: WS.Params.Ready) {
    const { id: userId } = await this.guard.decodeKey(token);
    if (!userId)
      throw new TypeError('Invalid User ID');

    ws.sessions.set(client.id, userId);

    const user = await this.users.getSelf(userId);
    await this.rooms.join(client, user);

    user.status = 'ONLINE';
    await user.save();

    const guildIds = user.guilds.map(g => g.id);

    ws.io
      .to(guildIds.concat(user.friendIds))
      .emit('PRESENCE_UPDATE', {
        userId,
        status: user.status
      } as WS.Args.PresenceUpdate);

    ws.io
      .to(client.id)
      .emit('READY', { user } as WS.Args.Ready);
  }
}
