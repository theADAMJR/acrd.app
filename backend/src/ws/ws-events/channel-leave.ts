import Channels from '../../data/channels';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSGuard } from '../modules/ws-guard';
import { WSEvent } from './ws-event';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import { VoiceService } from '../../voice/voice-service';
import Users from '../../data/users';
import { SelfUserDocument } from '../../data/models/user';

export default class implements WSEvent<'CHANNEL_LEAVE'> {
  on = 'CHANNEL_LEAVE' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private voice = Deps.get<VoiceService>(VoiceService),
    private users = Deps.get<Users>(Users),
  ) {}

  public async invoke(ws: WebSocket, client: Socket) {
    const userId = ws.sessions.get(client.id);
    const user = await this.users.getSelf(userId);
    
    const channel = await this.channels.getVoice(user.voice.channelId);
    if (channel.type !== 'VOICE')
      throw new TypeError('You cannot leave a non-voice channel');
    
    // TODO: validate can join
    const doesExist = channel.userIds.includes(userId); 
    if (!doesExist)
      throw new TypeError('User not connected to voice');

    // join voice server
    this.voice.remove(channel.id, userId);

    await Promise.all([
      this.channels.leaveVC(channel, userId),
      this.updateVoiceState(user),
    ]);

    ws.io
      .to(channel.guildId)
      .emit('CHANNEL_UPDATE', {
        channelId: channel.id,
        partialChannel: { userIds: channel.userIds },
      } as WS.Args.ChannelUpdate);

    ws.io
      .to(channel.id)
      .emit('VOICE_STATE_UPDATE', {
        userId: user.id,
        voice: user.voice,
      } as WS.Args.VoiceStateUpdate);

    // leave after they receive event
    await client.leave(channel.id);
  }

  private async updateVoiceState(user: SelfUserDocument) {
    user.voice = { channelId: undefined };
    await user.save();
  }
}