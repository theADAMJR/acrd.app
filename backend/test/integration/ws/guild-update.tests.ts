import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import GuildUpdate from '../../../src/ws/ws-events/guild-update';
import { Guild, GuildDocument } from '../../../src/data/models/guild';
import { SelfUserDocument, UserDocument } from '../../../src/data/models/user';
import { Mock } from '../../mock/mock';
import { expect } from 'chai';
import { GuildMemberDocument } from '../../../src/data/models/guild-member';
import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { PermissionTypes } from '../../../src/types/permission-types';

describe('guild-update', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  let ws: WebSocket;
  let event: GuildUpdate;

  let guild: GuildDocument;
  let member: GuildMemberDocument;

  beforeEach(async () => {
    ({ ws, event, guild, member } = await Mock.defaultSetup(client, GuildUpdate));
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

  function guildUpdate(partial: Partial<Entity.Guild>) {
    return event.invoke(ws, client, {
      guildId: guild.id,
      ...partial,
    });
  }

  function makeOwner() {
    ws.sessions.set(client.id, guild.ownerId);
  }  
});