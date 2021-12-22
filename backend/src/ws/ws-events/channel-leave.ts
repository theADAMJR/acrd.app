import { WSEvent } from './ws-event';
import { WebSocket } from '../websocket';
import { Socket } from 'socket.io';
import { SelfUserDocument } from '../../data/models/user';
import { ChannelDocument } from '../../data/models/channel';

export default class implements WSEvent<'CHANNEL_LEAVE'> {
  public on = 'CHANNEL_LEAVE' as const;

  public async invoke(ws: WebSocket, client: Socket) {
    const userId = ws.sessions.get(client.id);
    const user = await deps.users.getSelf(userId);

    await this.updateVoiceState(user);
    const oldChannel = await deps.channels.getSafely(user.voice.channelId);
    const channelLeaveAction = (oldChannel)
      ? await this.handleExistingVC(oldChannel, userId, ws, client)
      : undefined;

    return [channelLeaveAction, {
      emit: 'VOICE_STATE_UPDATE' as const,
      to: [client.id],
      send: { userId: user.id, voice: user.voice },
    }];
  }

  private async handleExistingVC(oldChannel: ChannelDocument, userId: string, ws: WebSocket, client) {
    if (oldChannel.type !== 'VOICE')
      throw new TypeError('You cannot leave a non-voice channel');

    const doesExist = oldChannel.userIds.includes(userId);
    if (!doesExist)
      throw new TypeError('User not connected to voice');

    // leave voice server
    deps.voiceService.remove(oldChannel.id, userId);
    await deps.channels.leaveVC(oldChannel, userId);

    await client.leave(oldChannel.id);

    return {
      emit: 'CHANNEL_UPDATE' as const,
      to: [oldChannel.guildId],
      send: {
        channelId: oldChannel.id,
        partialChannel: { userIds: oldChannel.userIds },
      },
    };
  }

  private async updateVoiceState(user: SelfUserDocument) {
    user.voice = { channelId: undefined };
    await user.save();
  }
}