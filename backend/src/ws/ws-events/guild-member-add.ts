import { Socket } from 'socket.io';
import GuildMembers from '../../data/guild-members';
import Guilds from '../../data/guilds';
import Invites from '../../data/invites';
import { InviteDocument } from '../../data/models/invite';
import Users from '../../data/users';
import { WS } from '../../types/ws';
import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_ADD'> {
  on = 'GUILD_MEMBER_ADD' as const;

  public async invoke(ws: WebSocket, client: Socket, { inviteCode }: WS.Params.GuildMemberAdd) {
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
      deps.guildMembers.create(guild.id, selfUser),,
    ]);
    const entities = await deps.guilds.getEntities(guild.id);
    client.emit('GUILD_CREATE', { guild, ...entities } as WS.Args.GuildCreate);

    ws.io
      .to(guild.id)
      .emit('GUILD_MEMBER_ADD', {
        guildId: guild.id,
        member,
        user: selfUser,
      } as WS.Args.GuildMemberAdd);

    await client.join(guild.id);
    
    await deps.messages.createSystem(guild.id, `<@${selfUser.id}> joined the guild.`);
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
