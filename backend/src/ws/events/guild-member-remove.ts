import { Socket } from 'socket.io';
import { Guild } from '../../data/guild';
import { Invite } from '../../data/invite';
import { User } from '../../data/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_REMOVE'> {
  public on = 'GUILD_MEMBER_REMOVE' as const;

  public async invoke({ io, sessions }: WS, client: Socket, { guildId, userId }: WSPayload.GuildMemberRemove) {
    // validate user is not owner
    const guild = await Guild.findById(guildId);
    if (!guild)
      throw new TypeError('Guild not found');
    
    if (guild.ownerId === userId)
      throw new TypeError('You cannot leave a server you own');
    
    // remove guildId from user.guilds
    const user = await User.findById(userId);
    user!.guilds = user!.guilds.filter(id => id !== guildId);
    await user!.save();    
    
    // if self user left, emit GUILD_DELETE
    const selfUserId = sessions.get(client.id);
    if (selfUserId === userId)
      io.to(guildId)
        .emit('GUILD_DELETE', { guildId } as WSResponse.GuildDelete);
    
    io.to(guildId)
      .emit('GUILD_MEMBER_REMOVE', { guildId, userId } as WSResponse.GuildMemberRemove);
  }
}