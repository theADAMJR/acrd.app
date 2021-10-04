import Deps from '../../../src/utils/deps';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import { WebSocket } from '../../../src/ws/websocket';
import { GuildMember, GuildMemberDocument } from '../../../src/data/models/guild-member';
import { Channel, ChannelDocument } from '../../../src/data/models/channel';
import { PermissionTypes } from '../../../src/types/permission-types';
import { WSGuard } from '../../../src/ws/modules/ws-guard';
import Channels from '../../../src/data/channels';

describe.only('ws-guard', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  
  let guard: WSGuard;
  let guild: GuildDocument;
  let member: GuildMemberDocument;
  let user: UserDocument;
  let ws: WebSocket;
  let textChannel: ChannelDocument;

  beforeEach(async () => {
    ({ ws, guild, user, member } = await Mock.defaultSetup(client));

    textChannel = await Deps.get<Channels>(Channels).getSystem(guild.id);
    guard = Deps.get<WSGuard>(WSGuard); 
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('validateIsOwner, is not owner, throws error', async () => {
    await expect(
      guard.validateIsOwner(client, guild.id)
    ).to.be.rejectedWith('Only the guild owner can do this');
  });

  it('validateIsOwner, is owner, fulfilled', async () => {
    ws.sessions.set(client.id, guild.ownerId);

    await expect(
      guard.validateIsOwner(client, guild.id)
    ).to.be.fulfilled;
  });

  it('validateIsUser, is impostor, throws error', async () => {
    const result = () => guard.validateIsUser(client, guild.ownerId);
    expect(result).to.throw('Unauthorized');
  });

  it('validateIsUser, is user, fulfilled', async () => {
    const result = () => guard.validateIsUser(client, user.id);
    expect(result).to.not.throw;
  });

  it('can access text channel, default perms, fulfilled', async () => {    
    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access text channel, no perms, rejected', async () => {
    await Mock.clearRolePerms(guild);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.rejectedWith('Missing Permissions');
  });

  it('can access channel without use, can only read messages, fulfilled', async () => {
    await Mock.clearRolePerms(guild);
    await Mock.givePerm(guild, member, PermissionTypes.Text.READ_MESSAGES);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access channel with use, can only read messages, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await Mock.givePerm(guild, member, PermissionTypes.Text.READ_MESSAGES);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access channel with use, can send and read messages, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await Mock.givePerm(guild, member,
      PermissionTypes.Text.READ_MESSAGES
      | PermissionTypes.Text.SEND_MESSAGES);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access text channel, guild admin, fulfilled', async () => {
    await Mock.giveEveryoneAdmin(guild);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access text channel, guild owner, fulfilled', async () => {
    await makeGuildOwner();

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can, not a guild member, rejected', async () => {
    await GuildMember.deleteOne({ userId: user.id });

    await expect(
      guard.validateCan(client, guild.id, PermissionTypes.Text.SEND_MESSAGES)
    ).to.be.rejectedWith('Member Not Found');
  });

  it('can, guild does not exist, rejected', async () => {
    await guild.deleteOne();

    await expect(
      guard.validateCan(client, guild.id, PermissionTypes.Text.SEND_MESSAGES)
    ).to.be.rejectedWith('Guild Not Found');
  });

  it('can, missing perms, rejected', async () => {
    await Mock.clearRolePerms(guild);

    await expect(
      guard.validateCan(client, guild.id, PermissionTypes.Text.SEND_MESSAGES)
    ).to.be.rejectedWith('Missing Permissions');
  });

  it('can, send messages, default perms, fulfilled', async () => {
    await expect(
      guard.validateCan(client, guild.id, PermissionTypes.Text.SEND_MESSAGES)
    ).to.be.fulfilled;
  });

  it('can, is owner, fulfilled', async () => {
    await makeGuildOwner();

    await expect(
      guard.validateCan(client, guild.id, PermissionTypes.Text.SEND_MESSAGES)
    ).to.be.fulfilled;
  });

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
