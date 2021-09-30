import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import GuildDelete from '../../../src/ws/ws-events/guild-delete';
import { User, UserDocument } from '../../../src/data/models/user';
import { Mock } from '../../mock/mock';
import { expect } from 'chai';
import { GuildMember, GuildMemberDocument } from '../../../src/data/models/guild-member';
import { Guild, GuildDocument } from '../../../src/data/models/guild';
import { Channel } from '../../../src/data/models/channel';
import { Invite } from '../../../src/data/models/invite';
import { Role } from '../../../src/data/models/role';

describe('guild-delete', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  let ws: WebSocket;
  let event: GuildDelete;

  let user: UserDocument;
  let member: GuildMemberDocument;
  let guild: GuildDocument;

  beforeEach(async () => {
    ({ ws, event, member, user, guild } = await Mock.defaultSetup(client, GuildDelete));

    await makeOwner();
  });

  afterEach(async () => Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('noob member deletes guild, rejected', async () => {
    await makeNoob();

    await expect(guildDelete()).to.be.rejectedWith('Only the guild owner can do this');
  });

  it('owner deletes guild, fulfilled', async () => {
    await expect(guildDelete()).to.be.fulfilled;
  });

  it('owner deletes guild, channels are removed from db', async () => {
    await guildDelete();

    const channels = await Channel.find({ guildId: guild.id });
    expect(channels).to.be.empty;
  });

  it('owner deletes guild, members are removed from db', async () => {
    await guildDelete();

    const members = await GuildMember.find({ guildId: guild.id });
    expect(members).to.be.empty;
  });

  it('owner deletes guild, invites are removed from db', async () => {
    await guildDelete();

    const invites = await Invite.find({ guildId: guild.id });
    expect(invites).to.be.empty;
  });

  it('owner deletes guild, roles are removed from db', async () => {
    await guildDelete();

    const roles = await Role.find({ guildId: guild.id });
    expect(roles).to.be.empty;
  });

  it('owner deletes guild, guild is removed from db', async () => {
    await guildDelete();

    guild = await Guild.findById(guild.id);
    expect(guild).to.be.null;
  });

  it('owner deletes guild, removed from all user guildIds', async () => {
    const oldCount = user.guildIds.length;
    await guildDelete();

    user = await User.findById(user.id);    
    expect(user.guildIds.length).to.be.lessThan(oldCount);
  });

  function guildDelete() {
    return event.invoke(ws, client, { guildId: guild.id });
  }

  async function makeOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    user = await User.findById(guild.ownerId);
  }
  async function makeNoob() {
    ws.sessions.set(client.id, user.id);
  }
});
