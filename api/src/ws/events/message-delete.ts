import { Socket } from 'socket.io';
import { temp } from '../../../../utils/src/temp';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export class MessageDelete implements WSEvent<'MESSAGE_DELETE'> {
  public on = 'MESSAGE_DELETE' as const;

  public async invoke(ws: WS, client: Socket, params: Params.MessageDelete) {
    const index = temp.messages.findIndex(m => m.id === params.messageId);
    temp.messages.splice(index, 1);

    ws.server.emit('MESSAGE_DELETE', params as Args.MessageDelete);
  }
}