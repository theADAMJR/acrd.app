import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { GuildDocument } from '../../data/models/guild';
import { GuildMember } from '../../data/models/guild-member';
import { SelfUserDocument } from '../../data/models/user';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_REMOVE'> {
  public on = 'GUILD_MEMBER_REMOVE' as const;

  public async invoke(ws: WebSocket, client: Socket, { guildId, userId }: WS.Params.GuildMemberRemove) {
    const guild = await deps.guilds.get(guildId);
    const members = await deps.guilds.getMembers(guildId);
    const member = members.find(m => m.userId === userId);    
    if (!member)
      throw new TypeError('Member does not exist');

    const selfUserId = ws.sessions.get(client.id);
    if (guild.ownerId === member.userId)
      throw new TypeError('You cannot leave a guild you own');
      
    else if (selfUserId !== member.userId)
      await deps.wsGuard.validateCan(client, guildId, 'KICK_MEMBERS');

    // TODO: validate user is higher before kicking them
      
    const user = await deps.users.getSelf(member.userId);
    const index = user.guildIds.indexOf(guildId);
    user.guildIds.splice(index, 1);
    await user.save();

    await GuildMember.deleteOne({ guildId, userId });

    const targetClientId = ws.sessions.getClientIdFromUserId(userId);
    if (targetClientId) {
      const memberClient = ws.io.sockets.sockets.get(targetClientId);
      memberClient?.emit('GUILD_DELETE', { guildId } as WS.Args.GuildDelete);
      await client.leave(guildId);
    }
    
    await this.leaveGuildRooms(client, guild);

    return [await this.leaveGuildMessage(guild, user), {
      emit: this.on,
      to: [guildId],
      send: { memberId: member.id },
    }, {
      emit: 'GUILD_DELETE' as const,
      to: [userId],
      send: { guildId },
    }];
  }
  
  private async leaveGuildMessage(guild: GuildDocument, user: SelfUserDocument) {
    try {
      const sysMessage = await deps.messages.createSystem(guild.id, `<@${user.id}> left the guild.`, 'GUILD_MEMBER_LEAVE');
  
      return {
        emit: 'MESSAGE_CREATE' as const,
        to: [guild.systemChannelId!],
        send: { message: sysMessage },
      };
    } catch {}
  }

  private async leaveGuildRooms(client: Socket, guild: GuildDocument) {
    await client.leave(guild.id);
    const guildChannels = await deps.guilds.getChannels(guild.id);
    for (const channel of guildChannels)
      await client.leave(channel.id);
  }
}
