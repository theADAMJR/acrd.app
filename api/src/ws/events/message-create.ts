import { Socket } from 'socket.io';
import { Message } from '../../data/message';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class MessageCreate implements WSEvent<'MESSAGE_CREATE'> {
  public on = 'MESSAGE_CREATE' as const;

  public async invoke(ws: WS, client: Socket, params: Params.MessageCreate) {
    const message = await Message.create({
      ...params,
      authorId: ws.sessions.get(client.id) as string,
    });

    ws.server.emit('MESSAGE_CREATE', { message } as Args.MessageCreate);
  }
}