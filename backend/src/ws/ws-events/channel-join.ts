import Channels from '../../data/channels';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WSEvent } from './ws-event';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import { VoiceService } from '../../voice/voice-service';

export default class implements WSEvent<'CHANNEL_JOIN'> {
  on = 'CHANNEL_JOIN' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private guard = Deps.get<WSGuard>(WSGuard),
    private voiceService = Deps.get<VoiceService>(VoiceService),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.ChannelJoin) {
    const userId = ws.sessions.get(channelId);

    if (true)
      throw new TypeError(`Join VC ${channelId}: Everything is working correctly;`)
    // TODO: validate can join
    
    await this.channels.joinVC(channelId, userId);
    // join voice server
    // voiceService.add(channelId, {  });
  }
}