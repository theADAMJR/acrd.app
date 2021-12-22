import { Socket } from 'socket.io';
import { Channel } from '../../data/models/channel';
import { SelfUserDocument } from '../../data/models/user';

export class WSRooms {
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
        if (channel.type === 'VOICE') continue;
        
        await deps.wsGuard.validateCanInChannel(client, channel.id, 'READ_MESSAGES');
        ids.push(channel.id);
      } catch {}    
    return ids;
  }
}
