import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'VOICE_DATA'> {
  on = 'VOICE_DATA' as const;

  public async invoke(ws: WebSocket, client: Socket, { channelId, blob }: WS.Params.VoiceData) {
    const userId = ws.sessions.get(client.id);
    const connections = deps.voiceService.setForUser(channelId, { blob, userId });

    return [{
      emit: this.on,
      to: [client.id],
      send: { channelId, connections },
    }];
  }
}
