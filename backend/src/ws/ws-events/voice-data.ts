import { Socket } from 'socket.io';
import { WS } from '../../types/ws';

import { VoiceService } from '../../voice/voice-service';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'VOICE_DATA'> {
  on = 'VOICE_DATA' as const;

  constructor(
    private voiceService = deps.voiceService,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId, blob }: WS.Params.VoiceData) {
    const userId = ws.sessions.get(client.id);
    const connections = this.voiceService.setForUser(channelId, { blob, userId });

    client.emit('VOICE_DATA', { channelId, connections } as WS.Args.VoiceData);
  }
}
