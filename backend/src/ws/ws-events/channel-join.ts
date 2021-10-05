import Channels from '../../data/channels';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSEvent } from './ws-event';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import { VoiceService } from '../../voice/voice-service';
import Users from '../../data/users';
import { SelfUserDocument } from '../../data/models/user';
import ChannelLeave from './channel-leave';
import VoiceData from './voice-data';

export default class implements WSEvent<'CHANNEL_JOIN'> {
  on = 'CHANNEL_JOIN' as const;

  constructor(
    private channels = Deps.get<Channels>(Channels),
    private voice = Deps.get<VoiceService>(VoiceService),
    private users = Deps.get<Users>(Users),
    private leaveEvent = Deps.get<ChannelLeave>(ChannelLeave),
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.ChannelJoin) {
    const channel = await this.channels.get(channelId);
    if (channel.type !== 'VOICE')
      throw new TypeError('You cannot join a non-voice channel');

    const userId = ws.sessions.get(client.id);
    const user = await this.users.getSelf(userId);
    const movedChannel = user.voice.channelId !== channelId;
  
    if (user.voice.channelId && movedChannel)
      await this.leaveEvent.invoke(ws, client);
    
    const doesExist = channel.userIds.includes(userId); 
    if (doesExist)
      throw new TypeError('User already connected to voice');

    // TODO: perms - validate can join 
    this.voice.add(channelId, { userId });
    
    await Promise.all([
      client.join(channelId),
      this.channels.joinVC(channel, userId),
      this.updateVoiceState(user, channelId),
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
  }

  private async updateVoiceState(user: SelfUserDocument, channelId: string) {
    user.voice = { channelId };
    return await user.save();
  }
}