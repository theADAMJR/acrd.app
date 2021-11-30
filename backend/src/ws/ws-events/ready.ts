import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import { SelfUserDocument } from '../../data/models/user';
import Users from '../../data/users';


import { WSGuard } from '../modules/ws-guard';
import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import ChannelJoin from './channel-join';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'READY'> {
  public on = 'READY' as const;
  public cooldown = 5;

  constructor(
    private channelJoinEvent = deps.channelJoin,
    private guard = deps.wsGuard,
    private rooms = deps.wsRooms,
    private users = deps.users,
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


    await this.handleUser(ws, user);
    await this.rooms.join(client, user);

    ws.io
      .to(client.id)
      .emit('READY', { user } as WS.Args.Ready);
  }

  private async handleUser(ws: WebSocket, user: SelfUserDocument) {
    // if (user.status === 'ONLINE') return;

    user.status = 'ONLINE';
    await user.save();

    ws.io
      .to(user.guildIds)
      .emit('PRESENCE_UPDATE', {
        userId: user.id,
        status: user.status
      } as WS.Args.PresenceUpdate);
  }
}
