import { Socket } from 'socket.io';
import { Invite } from '../../data/models/invite';
import { User } from '../../data/models/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_ADD'> {
  public on = 'GUILD_MEMBER_ADD' as const;

  // >v6: make sure user not banned
  // >v6: validate invite options
  public async invoke({ io, sessions }: WS, client: Socket, { inviteCode }: WSPayload.GuildMemberAdd) {
    const invite = await Invite.findById(inviteCode);
    if (!invite)
      throw new TypeError('Invite not found');
    
    const userId = sessions.get(client.id);
    const guildId = invite.guildId;
    
    // user cannot be undefined if authenticated, and validated to exist in ready
    const user = (await User.findById(userId))!;
    // prevent user from joining own guild
    if (user.guildIds.includes(guildId))
      throw new TypeError('You are already in this guild');

    user.guildIds.push(guildId);
    await user.save();

    // add use to invites
    invite.uses++;
    await invite.save();
    
    io.to(invite.guildId)
      .emit('GUILD_MEMBER_ADD', { guildId, member: user } as WSResponse.GuildMemberAdd);
  }
}