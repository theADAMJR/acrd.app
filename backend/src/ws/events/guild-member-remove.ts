import { Socket } from 'socket.io';
import { Guild } from '../../data/models/guild';
import { Invite } from '../../data/models/invite';
import { User } from '../../data/models/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_REMOVE'> {
  public on = 'GUILD_MEMBER_REMOVE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { guildId, userId }: API.WSPayload.GuildMemberRemove) {
    // validate user is not owner
    const guild = await Guild.findById(guildId);
    if (!guild)
      throw new TypeError('Guild not found');
    
    const selfUserId = sessions.get(client.id);
    const isOwner = guild.ownerId === selfUserId;
    if (isOwner && userId === selfUserId)
      throw new TypeError('You cannot leave a server you own');
    else if (!isOwner)
      throw new TypeError('You cannot manage other members');
    
    // remove guildId from user.guilds
    // FIXME:
    const user = await User.findById(userId);
    user!.guildIds = user!.guildIds.filter(id => id !== guildId);
    await user!.save();    

    // actually remove member from guild
    guild.members = guild.members.filter(id => (id as any) !== userId);
    await guild.save();
    
    // if self user left, emit GUILD_DELETE
    if (selfUserId === userId)
      io.to(guildId)
        .emit('GUILD_DELETE', { guildId } as API.WSResponse.GuildDelete);
    
    io.to(guildId)
      .emit('GUILD_MEMBER_REMOVE', { guildId, userId } as API.WSResponse.GuildMemberRemove);
  }
}