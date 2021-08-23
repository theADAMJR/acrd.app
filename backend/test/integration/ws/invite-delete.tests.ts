import InviteDelete from '../../../src/api/websocket/ws-events/invite-delete';
import { WebSocket } from '../../../src/api/websocket/websocket';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { Invite, InviteDocument } from '../../../src/data/models/invite';
import { expect } from 'chai';
import { RoleDocument } from '../../../src/data/models/role';

describe('invite-delete', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  let event: InviteDelete;
  let ws: WebSocket;

  let guild: GuildDocument;
  let invite: InviteDocument;
  let role: RoleDocument;

  beforeEach(async () => {
    ({ event, ws, guild, role } = await Mock.defaultSetup(client, InviteDelete));
  
    invite = await Mock.invite(guild.id);
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('guild member deletes invite, default perms, rejected', async () => {
    await expect(inviteDelete()).to.be.rejectedWith('Missing Permissions');
  });

  it('guild owner deletes invite, fulfilled', async () => {
    await Mock.clearRolePerms(guild);
    ws.sessions.set(client.id, guild.ownerId);

    await expect(inviteDelete()).to.be.fulfilled;
  });

  it('guild member, has manage guild perms, fulfilled', async () => {
    await Mock.giveRolePerms(role, PermissionTypes.General.MANAGE_GUILD);

    await expect(inviteDelete()).to.be.fulfilled;
  });

  it('invite deleted from db', async () => {
    await Mock.giveRolePerms(role, PermissionTypes.General.MANAGE_GUILD);
    await inviteDelete();

    invite = await Invite.findById(guild.id);
    expect(invite).to.be.null;
  });

  it('invite does not exist, rejected', async () => {
    await invite.deleteOne();

    await expect(inviteDelete()).to.be.rejectedWith('Invite Not Found');
  });

  function inviteDelete() {
    return event.invoke(ws, client, {
      inviteCode: invite.id,
    });
  }
});
