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
    private voice = Deps.get<VoiceService>(VoiceService),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.ChannelJoin) {
    const channel = await this.channels.get(channelId);
    if (channel.type !== 'VOICE')
      throw new TypeError('You cannot join a non-voice channel');
    
    // TODO: validate can join
    const userId = ws.sessions.get(client.id);
    await this.channels.joinVC(channelId, userId);
    // join voice server
    this.voice.add(channelId, { stream: null, userId });
  }
}