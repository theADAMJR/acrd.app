import { Socket } from 'socket.io';
import { User } from '../../data/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';
import jwt from 'jsonwebtoken';

export default class Ready implements WSEvent<'READY'> {
  public on = 'READY' as const;

  public async invoke(ws: WS, client: Socket, { token }) {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY) as Auth.Payload;
    if (!payload.userId)
      throw new TypeError('Invalid Token');
    
    const user = await User.findById(payload.userId);

    client.emit('READY', { user } as Args.Ready);
  }
}