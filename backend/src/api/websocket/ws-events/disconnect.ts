import { Socket } from 'socket.io';
import Channels from '../../../data/channels';
import { Channel } from '../../../data/models/channel';
import { UserDocument } from '../../../data/models/user';
import { Lean } from '../../../data/types/entity-types';
import Users from '../../../data/users';
import Deps from '../../../utils/deps';
import { WebSocket } from '../websocket';
import { WSEvent, Args } from './ws-event';

export default class implements WSEvent<'disconnect'> {
  on = 'disconnect' as const;

  constructor(
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket) {   
    const userId = ws.sessions.get(client.id);
    const user = await this.users.get(userId);
    
    ws.sessions.delete(client.id);
    await this.setOfflineStatus(ws, client, user);

    client.rooms.clear();
  }

  public async setOfflineStatus(ws: WebSocket, client: Socket, user: UserDocument) {
    const userConnected = ws.connectedUserIds.includes(user.id);    
    if (userConnected) return;

    user.status = 'OFFLINE';
    await user.save();

    const guildIds = user.guilds.map(g => g.id);

    ws.io
      .to(guildIds.concat(user.friendIds))
      .emit('PRESENCE_UPDATE', {
        userId: user.id,
        status: user.status
    } as Args.PresenceUpdate); 
  }
}
