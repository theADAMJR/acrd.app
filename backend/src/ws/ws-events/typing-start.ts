import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'TYPING_START'> {
  on = 'TYPING_START' as const;

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.TypingStart) {    
    if (!client.rooms.has(channelId))
      await client.join(channelId);
    
    return [{
      emit: this.on,
      to: [channelId],
      send: { userId: ws.sessions.userId(client), channelId },
    }];
  }
}
