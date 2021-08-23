import { Socket } from 'socket.io';
import { SelfUserDocument } from '../../../data/models/user';
import { Lean } from '../../../types/entity-types';
import Users from '../../../data/users';
import Deps from '../../../utils/deps';
import { WSGuard } from '../../modules/ws-guard';

export class WSRooms {
  constructor(
    private users = Deps.get<Users>(Users),
    private guard = Deps.get<WSGuard>(WSGuard),
  ) {}

  public async join(client: Socket, user: SelfUserDocument) {
    const alreadyJoinedRooms = client.rooms.size > 1;
    if (alreadyJoinedRooms) return;

    await client.join(await this.users.getRoomIds(user));
    
    await this.joinGuildRooms(user, client);
    await this.joinDMRooms(user, client);
  }

  private async joinDMRooms(user: SelfUserDocument, client: Socket) {
    const dms = await this.users.getDMChannels(user.id);
    if (!dms) return;

    const ids = dms.map(c => c.id);
    await client.join(ids);
  }

  public async joinGuildRooms(user: SelfUserDocument, client: Socket) {
    if (!user.guilds) return;

    const guildIds = user.guilds.map(g => g.id);
    await client.join(guildIds);

    const channelIds = await this.getChannelIds(client, user.guilds as any);
    await client.join(channelIds);        
  }

  private async getChannelIds(client: Socket, guilds: Entity.Guild[]) {
    const ids: string[] = [];
    const channelIds = guilds
      .flatMap(g => g.channels.map(c => c.id));    
    
    for (const id of channelIds)
      try {
        await this.guard.canAccessChannel(client, id);
        ids.push(id);
      } catch {}    
    return ids;
  }
}
