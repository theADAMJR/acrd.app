import GuildMemberAdd from '../../../src/ws/ws-events/guild-member-add';
import { WebSocket } from '../../../src/ws/websocket';

import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { UserDocument } from '../../../src/data/models/user';
import { GuildDocument } from '../../../src/data/models/guild';
import { Invite, InviteDocument } from '../../../src/data/models/invite';
import { expect, spy } from 'chai';
import Guilds from '../../../src/data/guilds';
import Users from '../../../src/data/users';
import { GuildMember } from '../../../src/data/models/guild-member';

describe('guild-member-add', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  let event: GuildMemberAdd;
  let ws: WebSocket;

  let user: SelfUserDocument;
  let guild: GuildDocument;
  let invite: InviteDocument;

  beforeEach(async() => {
    ({ event, ws, user, guild } = await Mock.defaultSetup(client, GuildMemberAdd));

    user = await Mock.user([]);
    ws.sessions.set(client.id, user.id);

    invite = await Mock.invite(guild.id);
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('valid invite and code, fulfilled', async () => {
    await expect(guildMemberAdd()).to.be.fulfilled;
  });

  it('user already joined, rejected', async () => {
    await guildMemberAdd();
    await expect(guildMemberAdd()).to.be.rejectedWith('User already in guild');
  });

  it('valid invite and code, is bot user, rejected', async () => {
    const bot = await Mock.bot();
    ws.sessions.set(client.id, bot.id);

    await expect(guildMemberAdd()).to.be.rejectedWith('Bot users cannot accept invites');
  });

  it('valid invite and code, member added to guild', async () => {
    const oldMemberCount = await GuildMember.count({ guildId: guild.id });
    await guildMemberAdd();    

    const newMemberCount = await GuildMember.count({ guildId: guild.id });
    expect(newMemberCount).to.be.greaterThan(oldMemberCount);
  });

  it('valid invite and code, guild added to user guilds', async () => {
    await guildMemberAdd();

    user = await Mock.users.get(user.id);    
    expect(user.guildIds.length).to.equal(1);
  });

  it('invite has reached max uses, is deleted', async () => {
    invite.options = { maxUses: 1 };
    await invite.save();

    await guildMemberAdd();
    invite = await Invite.findById(invite.id);
    expect(invite).to.be.null;
  });

  it('invite expired, rejected', async () => {
    invite.options = { expiresAt: new Date(0) };
    await invite.save();

    await expect(guildMemberAdd()).to.be.rejectedWith('Invite expired');
  });

  it('invalid invite code, rejected', async () => {
    invite.id = '';
    await expect(guildMemberAdd()).to.be.rejectedWith('Invite Not Found');
  });

  function guildMemberAdd() {
    return event.invoke(ws, client, { inviteCode: invite.id });
  }
});
