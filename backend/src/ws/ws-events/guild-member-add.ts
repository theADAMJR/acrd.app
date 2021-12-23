import { WS } from '@accord/types';
import { Socket } from 'socket.io';
import { GuildDocument } from '../../data/models/guild';
import { InviteDocument } from '../../data/models/invite';
import { SelfUserDocument } from '../../data/models/user';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_ADD'> {
  public on = 'GUILD_MEMBER_ADD' as const;

  public async invoke(ws: WebSocket, client: Socket, { inviteCode }: WS.Params.GuildMemberAdd) {
    if (!inviteCode)
      throw new TypeError('Not enough options were provided');
    
    const invite = await deps.invites.get(inviteCode);
    const guild = await deps.guilds.get(invite.guildId);
    const userId = ws.sessions.userId(client);
    
    const members = await deps.guilds.getMembers(guild.id);
    const inGuild = members.some(m => m.userId === userId);
    if (inGuild)
      throw new TypeError('User already in guild');
    
    const selfUser = await deps.users.getSelf(userId);
    if (inviteCode && selfUser.bot)
      throw new TypeError('Bot users cannot accept invites');

    const [_, __, member] = await Promise.all([
      this.handleInvite(invite),
      deps.wsRooms.joinGuildRooms(selfUser, client),
      deps.guildMembers.create({ guildId: guild.id, userId: selfUser.id }),
    ]);
    const entities = await deps.guilds.getEntities(guild.id);
    client.emit('GUILD_CREATE', { guild, ...entities } as WS.Args.GuildCreate);

    await client.join(guild.id);

    return [await this.joinGuildMessage(guild, selfUser, ws), {
      emit: this.on,
      to: [guild.id],
      send: {
        guildId: guild.id,
        member,
        user: selfUser,
      },
    }];
  }
  
  private async joinGuildMessage(guild: GuildDocument, selfUser: SelfUserDocument, ws: WebSocket) {
    try {
      const sysMessage = await deps.messages.createSystem(guild.id, `<@${selfUser.id}> joined the guild.`, 'GUILD_MEMBER_JOIN');
  
      return {
        emit: 'MESSAGE_CREATE' as const,
        to: [guild.systemChannelId!],
        send: { message: sysMessage },
      };
    } catch {}
  }

  private async handleInvite(invite: InviteDocument) {
    const inviteExpired = Number(invite.options?.expiresAt?.getTime()) < new Date().getTime();
    if (inviteExpired)
      throw new TypeError('Invite expired');
    
    invite.uses++;

    (invite.options?.maxUses && invite.uses >= invite.options.maxUses)
      ? await invite.deleteOne()
      : await invite.save();
  }
}
