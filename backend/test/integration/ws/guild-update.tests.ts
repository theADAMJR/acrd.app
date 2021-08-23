import { WebSocket } from '../../../src/api/websocket/websocket';
import io from 'socket.io-client';
import GuildUpdate from '../../../src/api/websocket/ws-events/guild-update';
import { Guild, GuildDocument } from '../../../src/data/models/guild';
import { UserDocument } from '../../../src/data/models/user';
import { Mock } from '../../mock/mock';
import { expect } from 'chai';
import { GuildMemberDocument } from '../../../src/data/models/guild-member';
import { generateSnowflake } from '../../../src/data/snowflake-entity';

describe('guild-update', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  let ws: WebSocket;
  let event: GuildUpdate;

  let guild: GuildDocument;
  let user: UserDocument;
  let member: GuildMemberDocument;

  beforeEach(async () => {
    ({ ws, event, guild, member, user } = await Mock.defaultSetup(client, GuildUpdate));
  });

  afterEach(async () => Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('spoofed user, rejected', async () => {
    ws.sessions.set(client.id, generateSnowflake());
    await expect(guildUpdate(guild)).to.be.rejectedWith('Member Not Found');
  });

  it('member has insufficient perms, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await expect(guildUpdate({})).to.be.rejectedWith('Missing Permissions');
  });

  it('user has MANAGE_GUILD perms, fulfilled', async () => {
    await Mock.givePerm(guild, member, PermissionTypes.All.MANAGE_GUILD);
    await expect(guildUpdate({})).to.be.fulfilled;
  });

  it('user is owner, fulfilled', async () => {
    makeOwner();
    await expect(guildUpdate({})).to.be.fulfilled;
  });

  it('name acronym updated', async () => {
    makeOwner();
    await guildUpdate({ name: 'K E K K' });

    guild = await Guild.findById(guild.id);
    expect(guild.nameAcronym).to.equal('KEK');
  });

  it('contains banned keys, rejected', async () => {
    makeOwner();
    await expect(guildUpdate({ id: '123' })).to.be.rejectedWith('Contains readonly values');
  });

  it('reordered roles correctly, fulfilled', async () => {
    makeOwner();

    const roleIds = guild.roles.map(r => r.id);
    await expect(guildUpdate({ roles: roleIds as any })).to.be.fulfilled;
  });

  it('reordered roles, added a role, rejected', async () => {
    makeOwner();
    const newRole = await Mock.role(guild);
    const roleIds = guild.roles.concat(newRole).map(r => r.id);

    await expect(guildUpdate({ roles: roleIds as any })).to.be.rejectedWith('Cannot add or remove roles this way');
  });

  it('reordered roles, removed a role, rejected', async () => {
    makeOwner();
    await Mock.role(guild);
    const roleIds = guild.roles.slice(0, 1);

    await expect(guildUpdate({ roles: roleIds as any })).to.be.rejectedWith('Cannot add or remove roles this way');
  });

  it('reordered roles, moved everyone role, rejected', async () => {
    makeOwner();
    const roleIds = [generateSnowflake(), ...guild.roles];

    await expect(guildUpdate({ roles: roleIds as any })).to.be.rejectedWith('Cannot reorder the @everyone role');
  });

  it('sorted channels, did not add channels, fulfilled', async () => {
    makeOwner();

    const roleIds = guild.channels.map(r => r.id);
    await expect(guildUpdate({ channels: roleIds as any })).to.be.fulfilled;
  });

  it('sorted channels, added a channel, rejected', async () => {
    makeOwner();
    const channel = await Mock.channel(guild);
    const channelIds = guild.channels.concat(channel).map(r => r.id);

    await expect(guildUpdate({ channels: channelIds as any })).to.be.rejectedWith('Cannot add or remove channels this way');
  });

  it('sorted channels, removed a channel, rejected', async () => {
    makeOwner();
    await Mock.channel(guild);
    const channelIds = guild.channels.slice(0, 1);

    await expect(guildUpdate({ channels: channelIds as any })).to.be.rejectedWith('Cannot add or remove channels this way');
  });

  function guildUpdate(partialGuild: PartialEntity.Guild) {
    return event.invoke(ws, client, {
      guildId: guild.id,
      partialGuild,
    });
  }

  function makeOwner() {
    ws.sessions.set(client.id, guild.ownerId);
  }  
});