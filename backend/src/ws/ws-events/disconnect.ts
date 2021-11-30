import { Socket } from 'socket.io';
import { SelfUserDocument, UserDocument } from '../../data/models/user';
import { WebSocket } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'disconnect'> {
  on = 'disconnect' as const;

  public async invoke(ws: WebSocket, client: Socket) {   
    const userId = ws.sessions.get(client.id);
    const user = await deps.users.getSelf(userId);
    
    
    try {
      await deps.channelLeaveEvent.invoke(ws, client);
    } catch {}
    
    ws.sessions.delete(client.id);
    await this.handleUser(ws, user);
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
