import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'TYPING_START'> {
  public on = 'TYPING_START' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { channelId }: API.WSPayload.TypingStart) {
    io.to(channelId)
      .except(client.id)
      .emit('TYPING_START', {
        channelId,
        userId: sessions.get(client.id),
      } as API.WSResponse.TypingStart);
  }
}