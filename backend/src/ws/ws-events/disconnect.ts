import { Socket } from 'socket.io';
import Channels from '../../data/channels';
import { SelfUserDocument, UserDocument } from '../../data/models/user';
import Users from '../../data/users';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WebSocket } from '../websocket';
import ChannelLeave from './channel-leave';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'disconnect'> {
  on = 'disconnect' as const;

  constructor(
    private channelLeaveEvent = Deps.get<ChannelLeave>(ChannelLeave),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket) {   
    const userId = ws.sessions.get(client.id);
    const user = await this.users.getSelf(userId);
    
    try {
      await this.channelLeaveEvent.invoke(ws, client);
    } catch {}

    await this.handleUser(ws, user);
    
    ws.sessions.delete(client.id);
    client.rooms.clear();
  }

  public async handleUser(ws: WebSocket, user: SelfUserDocument) {
    const userConnected = ws.connectedUserIds.includes(user.id);    
    if (userConnected) return;

    user.status = 'OFFLINE';
    await user.save();

    ws.io
      .to(user.guildIds)
      .emit('PRESENCE_UPDATE', {
        userId: user.id,
        status: user.status
    } as WS.Args.PresenceUpdate); 
  }
}
