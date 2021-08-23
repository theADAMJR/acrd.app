import Deps from '../../../src/utils/deps';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { UserDocument } from '../../../src/data/models/user';
import { WSGuard } from '../../../src/api/modules/ws-guard';
import { expect } from 'chai';
import { WebSocket } from '../../../src/api/websocket/websocket';
import { GuildMember } from '../../../src/data/models/guild-member';
import { Role } from '../../../src/data/models/role';
import { TextChannelDocument, VoiceChannelDocument } from '../../../src/data/models/channel';

describe('ws-guard', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  
  let guard: WSGuard;
  let guild: GuildDocument;
  let user: UserDocument;
  let ws: WebSocket;
  let textChannel: TextChannelDocument;
  let voiceChannel: VoiceChannelDocument;

  beforeEach(async () => {
    ({ ws, guild, user } = await Mock.defaultSetup(client));

    textChannel = guild.channels[0] as any;
    voiceChannel = guild.channels[1] as any;

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

    await updateEveryoneRole(PermissionTypes.Text.READ_MESSAGES);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access channel with use, can only read messages, rejected', async () => {
    await Mock.clearRolePerms(guild);

    await updateEveryoneRole(PermissionTypes.Text.READ_MESSAGES);

    await expect(
      guard.canAccessChannel(client, textChannel.id)
    ).to.be.fulfilled;
  });

  it('can access channel with use, can send and read messages, rejected', async () => {
    await Mock.clearRolePerms(guild);

    await updateEveryoneRole(PermissionTypes.Text.READ_MESSAGES
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

  it('can access voice channel, no perms, rejected', async () => {
    await Mock.clearRolePerms(guild);

    await expect(
      guard.canAccessChannel(client, voiceChannel.id)
    ).to.be.rejectedWith('Missing Permissions');
  });

  it('can access voice channel with use, can only connect, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await updateEveryoneRole(PermissionTypes.Voice.CONNECT);

    await expect(
      guard.canAccessChannel(client, voiceChannel.id)
    ).to.be.fulfilled;
  });

  it('can access voice channel with use, can connect and speak, fulfilled', async () => {
    await Mock.clearRolePerms(guild);

    await updateEveryoneRole(PermissionTypes.Voice.CONNECT
      | PermissionTypes.Voice.SPEAK);

    await expect(
      guard.canAccessChannel(client, voiceChannel.id)
    ).to.be.fulfilled;
  });

  it('can access voice channel, default perms, fulfilled', async () => {
    await expect(
      guard.canAccessChannel(client, voiceChannel.id)
    ).to.be.fulfilled;
  });

  it('can access voice channel, guild owner, fulfilled', async () => {
    await makeGuildOwner();

    await expect(
      guard.canAccessChannel(client, voiceChannel.id)
    ).to.be.fulfilled;
  });

  it('can access channel, dm, not a member, rejected', async () => {
    const dm = await Mock.channel({ type: 'DM' });

    await expect(
      guard.canAccessChannel(client, dm.id)
    ).to.be.rejectedWith('Not DM Member');
  });

  it('can access channel, dm, is member, fulfilled', async () => {
    const dm = await Mock.channel({ type: 'DM' });
    dm.memberIds.push(user.id);
    await dm.updateOne(dm);

    await expect(
      guard.canAccessChannel(client, dm.id)
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

  async function updateEveryoneRole(permissions: PermissionTypes.Permission) {
    const role = guild.roles[0];
    await Role.updateOne(
      { _id: role.id },
      { permissions },
    );
  }

  async function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
    await Mock.clearRolePerms(guild);
  }
});
