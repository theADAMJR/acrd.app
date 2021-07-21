import { Socket } from 'socket.io';
import { snowflake } from '../../../../utils/src/snowflake';
import { temp } from '../../../../utils/src/temp';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export class MessageCreate implements WSEvent<'MESSAGE_CREATE'> {
  public on = 'MESSAGE_CREATE' as const;

  public async invoke(ws: WS, client: Socket, params: Params.MessageCreate) {
    const message = {
      id: snowflake.generate(),
      authorId: ws.sessions.get(client.id) as string,
      content: params.content,
    };
    temp.messages.push(message);

    ws.server.emit('MESSAGE_CREATE', message as Args.MessageCreate);
  }
}