import { Socket } from 'socket.io';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'TYPING_START'> {
  public on = 'TYPING_START' as const;

  public async invoke({ io, sessions }: WS, client: Socket, args: WSPayload.TypingStart) {
    io.to(args.channelId)
      .emit('TYPING_START', {
        channelId: args.channelId,
        userId: sessions.get(client.id),
      } as WSResponse.TypingStart);
  }
}