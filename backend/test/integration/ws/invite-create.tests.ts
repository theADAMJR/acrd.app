import InviteCreate from '../../../src/api/websocket/ws-events/invite-create';
import { WebSocket } from '../../../src/api/websocket/websocket';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { expect } from 'chai';
import { Role, RoleDocument } from '../../../src/data/models/role';
import { PermissionTypes } from '../../../src/data/types/entity-types';

describe('invite-create', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;
  let event: InviteCreate;
  let ws: WebSocket;

  let guild: GuildDocument;
  let role: RoleDocument;

  beforeEach(async () => {
    ({ event, ws, guild, role } = await Mock.defaultSetup(client, InviteCreate));
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('member with create invite perms, fulfilled', async () => {
    await Mock.giveRolePerms(role, PermissionTypes.General.CREATE_INVITE);    
    await expect(inviteCreate()).to.be.fulfilled;
  });

  it('member with no perms, rejected', async () => {
    await Mock.clearRolePerms(guild);
    await expect(inviteCreate()).to.be.rejectedWith('Missing Permissions');
  });

  function inviteCreate() {
    return event.invoke(ws, client, {
      guildId: guild.id,
      options: {},
    });
  }
});
