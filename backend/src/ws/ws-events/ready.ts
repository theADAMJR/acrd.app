import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import { SelfUserDocument } from '../../data/models/user';
import Users from '../../data/users';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import ChannelJoin from './channel-join';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'READY'> {
  public on = 'READY' as const;
  public cooldown = 5;

  constructor(
    private channelJoinEvent = Deps.get<ChannelJoin>(ChannelJoin),
    private guard = Deps.get<WSGuard>(WSGuard),
    private rooms = Deps.get<WSRooms>(WSRooms),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { token }: WS.Params.Ready) {
    const { id: userId } = await this.guard.decodeKey(token);
    if (!userId)
      throw new TypeError('Invalid User ID');

    ws.sessions.set(client.id, userId);

    const user = await this.users.getSelf(userId);

    try {
      if (user.voice.channelId)
        await this.channelJoinEvent.invoke(ws, client, {
          channelId: user.voice.channelId,
        });
    } catch {}

    await Promise.all([
      this.handleUser(user),
      this.rooms.join(client, user),
    ]);

    ws.io
      .to(user.guildIds)
      .emit('PRESENCE_UPDATE', {
        userId,
        status: user.status
      } as WS.Args.PresenceUpdate);

    ws.io
      .to(client.id)
      .emit('READY', { user } as WS.Args.Ready);
  }

  private async handleUser(user: SelfUserDocument) {
    user.status = 'ONLINE';
    return await user.save();
  }
}
