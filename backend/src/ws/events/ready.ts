import { Socket } from 'socket.io';
import { User } from '../../data/models/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';
import jwt from 'jsonwebtoken';
import { Guild } from '../../data/models/guild';

export default class Ready implements WSEvent<'READY'> {
  public on = 'READY' as const;

  public async invoke(ws: WS, client: Socket, { token }) {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY) as Auth.Payload;
    if (!payload.userId)
      throw new TypeError('Invalid token');
    
    const user = await User.findById(payload.userId);
    if (!user)
      throw new TypeError('User not found');

    ws.sessions.set(client.id, user.id);

    const guilds = await Guild.find({ _id: user.guildIds });
    const channelIds = guilds.flatMap(g => g.channels) as any; 

    await client.join(user.guildIds);
    await client.join(channelIds);
    
    client.emit('READY', { user } as API.WSResponse.Ready); 
  }
}