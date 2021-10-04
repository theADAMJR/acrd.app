import { Socket } from 'socket.io';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { VoiceService } from '../../voice/voice-service';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'VOICE_DATA'> {
  on = 'VOICE_DATA' as const;

  constructor(
    private voiceService = Deps.get<VoiceService>(VoiceService),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.VoiceData) {
    const userId = ws.sessions.get(client.id);
    // receive data 
    // channel id of voice channel?
    // -> if specified in args it can be spoofed
    // -> if we constantly get user voice state from db that's very inefficient
    
    // send audio back to client
    const connections = this.voiceService.getForUser(channelId, userId);

    client.emit('VOICE_DATA', { connections } as WS.Args.VoiceData);
  }
}
