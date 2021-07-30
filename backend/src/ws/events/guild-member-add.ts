import { Socket } from 'socket.io';
import { Invite } from '../../data/invite';
import { User } from '../../data/user';
import { WS } from '../websocket';
import { WSEvent } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_ADD'> {
  public on = 'GUILD_MEMBER_ADD' as const;

  // >v6: make sure user not banned
  // >v6: validate invite options
  public async invoke({ io, sessions }: WS, client: Socket, { inviteCode }: Params.GuildMemberAdd) {
    const invite = await Invite.findById(inviteCode);
    if (!invite)
      throw new TypeError('Invite not found');
    
    const userId = sessions.get(client.id);
    const guildId = invite.guildId;

    // user cannot be undefined if authenticated, and validated to exist in ready
    const user = await User.findById(userId);
    user!.guilds.push(guildId);

    invite.uses++;
    await invite.save();
    
    io.to(invite.guildId)
      .emit('GUILD_MEMBER_ADD', { guildId, member: user } as Args.GuildMemberAdd);
  }
}