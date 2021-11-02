
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { SelfUserDocument, UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import { WebSocket } from '../../../src/ws/websocket';
import { GuildMember, GuildMemberDocument } from '../../../src/data/models/guild-member';
import { ChannelDocument } from '../../../src/data/models/channel';
import { PermissionTypes } from '../../../src/types/permission-types';
import { WSGuard } from '../../../src/ws/modules/ws-guard';
import Channels from '../../../src/data/channels';
import { Role, RoleDocument } from '../../../src/data/models/role';

describe.only('ws-guard', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  
  let guard: WSGuard;
  let guild: GuildDocument;
  let ownerUser: SelfUserDocument;
  let everyoneRole: RoleDocument;
  let ws: WebSocket;
  let textChannel: ChannelDocument;

  beforeEach(async () => {
    ({ ws, guild, ownerUser, everyoneRole, textChannel } = await Mock.defaultSetup(client));

    guard = deps.wsGuard; 
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('validateIsOwner: is not owner, throws error', async () => {
    await expect(
      guard.validateIsOwner(client, guild.id)
    ).to.be.rejectedWith('Only the guild owner can do this');
  });

  it('validateIsOwner: is owner, fulfilled', async () => {
    ws.sessions.set(client.id, guild.ownerId);

    await expect(
      guard.validateIsOwner(client, guild.id)
    ).to.be.fulfilled;
  });

  it('validateIsUser: is impostor, throws error', async () => {
    const result = () => guard.validateIsUser(client, guild.ownerId);
    expect(result).to.throw('Unauthorized');
  });
  it('validateIsUser: is user, fulfilled', async () => {
    const result = () => guard.validateIsUser(client, ownerUser.id);
    expect(result).to.not.throw;
  });

  it('validateCan: missing SEND_MESSAGES, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await expect(
      guard.validateCan(client, guild.id, 'SEND_MESSAGES')
    ).to.be.rejectedWith('Missing Permissions: SEND_MESSAGES');
  });
  it('validateCan: has SEND_MESSAGES, fulfilled', async () => {
    await expect(
      guard.validateCan(client, guild.id, 'SEND_MESSAGES')
    ).to.be.fulfilled;
  });
  it('validateCan: is owner, fulfilled', async () => {
    await Mock.makeGuildOwner(ws, client, guild);
    await expect(
      guard.validateCan(client, guild.id, 'SEND_MESSAGES')
    ).to.be.fulfilled;
  });

  it('validateCanInChannel: denied inherant perms, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await expect(
      guard.validateCanInChannel(client, textChannel.id, 'SEND_MESSAGES')
    ).to.be.rejectedWith('Missing Permissions: SEND_MESSAGES');
  });
  it('validateCanInChannel: allowed inherant perms, fulfilled', async () => {
    await expect(
      guard.validateCanInChannel(client, textChannel.id, 'SEND_MESSAGES')
    ).to.be.fulfilled;
  });
  it('validateCanInChannel: allowed inherant perms, denied override perms, rejected', async () => {
    textChannel.overrides.push({
      roleId: everyoneRole.id,
      allow: 0,
      deny: PermissionTypes.Text.SEND_MESSAGES,
    });
    await textChannel.save();

    await expect(
      guard.validateCanInChannel(client, textChannel.id, 'SEND_MESSAGES')
    ).to.be.rejectedWith('Missing Permissions: SEND_MESSAGES');
  });
  it('validateCanInChannel: denied inherant perms, allowed override perms, fulfilled', async () => {
    await everyoneRole.updateOne({ permissions: 0 });
    textChannel.overrides.push({
      roleId: everyoneRole.id,
      allow: PermissionTypes.Text.SEND_MESSAGES,
      deny: 0,
    });
    await textChannel.save();

    await expect(
      guard.validateCanInChannel(client, textChannel.id, 'SEND_MESSAGES')
    ).to.be.fulfilled;
  });
});
