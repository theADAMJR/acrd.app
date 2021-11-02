import { Socket } from 'socket.io';
import { Channel } from '../../data/models/channel';
import { SelfUserDocument } from '../../data/models/user';
import Deps from '../../utils/deps';
import { WSGuard } from './ws-guard';

export class WSRooms {
  constructor(
    private guard = deps.wsCooldowns,
  ) {}

  public async join(client: Socket, user: SelfUserDocument) {
    const alreadyJoinedRooms = client.rooms.size > 1;
    if (alreadyJoinedRooms) return;
    
    await this.joinGuildRooms(user, client);
  }

  public async joinGuildRooms(user: SelfUserDocument, client: Socket) {
    if (!user.guildIds.length) return;

    await client.join(user.guildIds);
    const channelIds = await this.getChannelIds(client, user.guildIds);
    await client.join(channelIds);        
  }

  private async getChannelIds(client: Socket, guildIds: string[]) {
    const ids: string[] = [];
    const channels = await Channel.find({ guildId: { $in: guildIds }});
    
    for (const channel of channels)
      try {
        // TODO: TESTME
        if (channel.type === 'VOICE') continue;
        
        await this.guard.validateCanInChannel(client, channel.id, 'READ_MESSAGES');
        ids.push(channel.id);
      } catch {}    
    return ids;
  }
}
