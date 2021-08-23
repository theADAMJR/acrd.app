import GuildMemberRemove from '../../../src/api/websocket/ws-events/guild-member-remove';
import { WebSocket } from '../../../src/api/websocket/websocket';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { GuildDocument } from '../../../src/data/models/guild';
import { expect } from 'chai';
import { GuildMemberDocument } from '../../../src/data/models/guild-member';
import { User, UserDocument } from '../../../src/data/models/user';

describe('guild-member-remove', () => {
  const client = io(`http://localhost:${process.env.PORT}`) as any;

  let event: GuildMemberRemove;
  let ws: WebSocket;
  let user: UserDocument;
  let member: GuildMemberDocument;
  let guild: GuildDocument;

  beforeEach(async() => {
    ({ event, ws, guild, member, user } = await Mock.defaultSetup(client, GuildMemberRemove));
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('leaves guild that is member of, fulfilled', async () => {
    await expect(guildMemberRemove()).to.be.fulfilled;
  });

  it('leaves guild that is member of, fulfilled', async () => {
    await expect(guildMemberRemove()).to.be.fulfilled;
  });

  it('cannot leave owned guild, rejected', async () => {
    makeGuildOwner();

    await expect(guildMemberRemove()).to.be.rejectedWith('You cannot leave a guild you own');
  });

  it('leaves guild, removed from user guilds', async () => {
    await guildMemberRemove();

    user = await User.findById(user.id);
    expect(user.guilds).to.not.include(guild.id);
  });

  it('kick noob member, as noob member, missing permissions', async () => {
    await makeAnotherNoob();

    await expect(guildMemberRemove()).to.be.rejectedWith('Missing Permissions');
  });

  it('kick noob member, as guild owner, removed from user guilds', async () => {
    makeGuildOwner();

    member = guild.members[1] as GuildMemberDocument;
    await guildMemberRemove();

    user = await User.findById(member.userId);
    expect(user.guilds).to.not.include(guild.id);
  });

  function guildMemberRemove() {
    return event.invoke(ws, client, {
      guildId: guild.id,
      memberId: member.id,
    });
  }
    
  function makeGuildOwner() {
    member = guild.members[0] as GuildMemberDocument;
    ws.sessions.set(client.id, guild.ownerId);
  }
    
  async function makeAnotherNoob() {
    const user = await Mock.user();
    member = await Mock.guildMember(user, guild);
  }
});
