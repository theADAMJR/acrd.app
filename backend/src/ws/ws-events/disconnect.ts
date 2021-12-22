import { Socket } from 'socket.io';
import { SelfUserDocument } from '../../data/models/user';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'disconnect'> {
  public on = 'disconnect' as const;

  public async invoke(ws: WebSocket, client: Socket): Promise<any> {   
    const userId = ws.sessions.get(client.id);
    const user = await deps.users.getSelf(userId);
    
    try {
      await deps.channelLeaveEvent.invoke(ws, client);
    } catch {}
    
    ws.sessions.delete(client.id);
    return this.handleUser(ws, user);
  }

  public async handleUser(ws: WebSocket, user: SelfUserDocument) {
    const userConnected = ws.connectedUserIds.includes(user.id);    
    if (userConnected) return;

    user.status = 'OFFLINE';
    await user.save();

    return [{
      emit: 'PRESENCE_UPDATE' as const,
      to: user.guildIds,
      send: { userId: user.id, status: user.status },
    }];
  }
}
