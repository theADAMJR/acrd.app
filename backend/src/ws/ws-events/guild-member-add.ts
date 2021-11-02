import { Socket } from 'socket.io';
import GuildMembers from '../../data/guild-members';
import Guilds from '../../data/guilds';
import Invites from '../../data/invites';
import { InviteDocument } from '../../data/models/invite';
import Users from '../../data/users';
import { WS } from '../../types/ws';
import Deps from '../../utils/deps';
import { WSRooms } from '../modules/ws-rooms';
import { WebSocket } from '../websocket';
import { WSEvent, } from './ws-event';

export default class implements WSEvent<'GUILD_MEMBER_ADD'> {
  on = 'GUILD_MEMBER_ADD' as const;

  constructor(
    private guilds = deps.guilds,
    private members = deps.guildMembers,
    private invites = deps.invites,
    private rooms = deps.wsRooms,
    private users = deps.users,
  ) {}

  public async invoke(ws: WebSocket, client: Socket, { inviteCode }: WS.Params.GuildMemberAdd) {
    const invite = await this.invites.get(inviteCode);
    const guild = await this.guilds.get(invite.guildId);
    const userId = ws.sessions.userId(client);
    
    const members = await this.guilds.getMembers(guild.id);
    const inGuild = members.some(m => m.userId === userId);
    if (inGuild)
      throw new TypeError('User already in guild');
    
    const selfUser = await this.users.getSelf(userId);
    if (inviteCode && selfUser.bot)
      throw new TypeError('Bot users cannot accept invites');

    const [_, __, member] = await Promise.all([
      this.handleInvite(invite),
      this.rooms.joinGuildRooms(selfUser, client),
      this.members.create(guild.id, selfUser),,
    ]);
    const entities = await this.guilds.getEntities(guild.id);
    client.emit('GUILD_CREATE', { guild, ...entities } as WS.Args.GuildCreate);
    
    ws.io
      .to(guild.id)
      .emit('GUILD_MEMBER_ADD', {
        guildId: guild.id,
        member,
        user: selfUser,
      } as WS.Args.GuildMemberAdd);

    await client.join(guild.id);
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
