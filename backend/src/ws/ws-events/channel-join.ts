import { WSEvent } from './ws-event';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import { SelfUserDocument } from '../../data/models/user';

export default class implements WSEvent<'CHANNEL_JOIN'> {
  on = 'CHANNEL_JOIN' as const;

  public async invoke(ws: WebSocket, client: Socket, { channelId }: WS.Params.ChannelJoin) {
    const channel = await deps.channels.get(channelId);
    if (channel.type !== 'VOICE')
      throw new TypeError('You cannot join a non-voice channel');

    const userId = ws.sessions.get(client.id);
    const user = await deps.users.getSelf(userId);
    const movedChannel = user.voice.channelId !== channelId;
  
    if (user.voice.channelId && movedChannel)
      await deps.channelLeave.invoke(ws, client);
    
    const doesExist = channel.userIds.includes(userId); 
    if (doesExist)
      throw new TypeError('User already connected to voice');

    // TODO: perms - validate can join 
    deps.voiceService.add(channelId, { userId });
    
    await Promise.all([
      client.join(channelId),
      deps.channels.joinVC(channel, userId),
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