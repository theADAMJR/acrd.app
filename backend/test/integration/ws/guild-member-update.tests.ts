import GuildMemberUpdate from '../../../src/ws/ws-events/guild-member-update';
import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { expect } from 'chai';
import { GuildMember, GuildMemberDocument } from '../../../src/data/models/guild-member';
import { Role, RoleDocument } from '../../../src/data/models/role';

describe('guild-member-update', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;

  let event: GuildMemberUpdate;
  let ws: WebSocket;
  let member: GuildMemberDocument;
  let guild: GuildDocument;
  let role: RoleDocument;

  beforeEach(async() => {
    ({ event, ws, member, guild, role } = await Mock.defaultSetup(client, GuildMemberUpdate));
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('is noob member, missing permissions', async () => {
    await expect(guildMemberUpdate()).to.be.rejectedWith('Missing Permissions');
  });

  it('is role manager, fulfilled', async () => {
    await makeAllManager();
    await expect(guildMemberUpdate()).to.be.fulfilled;
  });

  it('is role manager, fulfilled', async () => {
    await makeAllManager();
    await expect(guildMemberUpdate()).to.be.fulfilled;
  });

  it('managed has same roles, rejected', async () => {
    member = await Mock.guildMember(await Mock.user(), guild);
    await makeAllManager();

    await expect(guildMemberUpdate()).to.be.rejectedWith('Member has higher roles');
  });

  it('managed is owner, rejected', async () => {
    member = new GuildMember(guild.members[0]);
    await makeAllManager();
    
    await expect(guildMemberUpdate()).to.be.rejectedWith('Member has higher roles');
  });

  it('roles updated, still has @everyone role', async () => {
    await makeAllManager();
    await guildMemberUpdate();

    member = await GuildMember.findById(member.id);
    role = await Role.findById(member.roleIds[0]);

    expect(role.name).to.equal('@everyone');
  });

  it('is guild owner, updates guild manager', async () => {
    makeGuildOwner();
    await makeAllManager();

    await expect(guildMemberUpdate()).to.be.fulfilled;
  });

  it('is role manager, updates noob member, fulfilled', async () => {
    await makeRoleManager();
    await expect(guildMemberUpdate()).to.be.fulfilled;
  });

  it('includes banned keys, rejected', async () => {
    await makeRoleManager();
    await expect(guildMemberUpdate({ id: '123' })).to.be.rejectedWith('Contains readonly values');
  });

  async function makeRoleManager() {
    const manager = await Mock.guildMember(await Mock.user(), guild);
    await Mock.givePerm(guild, manager, PermissionTypes.General.MANAGE_ROLES);
    
    ws.sessions.set(client.id, manager.userId);
  }

  function makeGuildOwner() {
    ws.sessions.set(client.id, guild.ownerId);
  }

  function makeAllManager() {
    return Mock.giveRolePerms(role, PermissionTypes.General.MANAGE_ROLES);
  }

  function guildMemberUpdate(partial?: PartialEntity.GuildMember) {
    return event.invoke(ws, client, {
      memberId: member.id,
      partialMember: {
        ...partial,
        roleIds: [],
      },
    });
  }
});
