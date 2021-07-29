import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { Message } from '../../data/message';
import { WSEvent } from './ws-event';

export default class MessageDelete implements WSEvent<'MESSAGE_DELETE'> {
  public on = 'MESSAGE_DELETE' as const;

  public async invoke(ws: WS, client: Socket, params: Params.MessageDelete) {
    await Message.deleteOne({ _id: params.messageId });

    ws.server.emit('MESSAGE_DELETE', params as Args.MessageDelete);
  }
}