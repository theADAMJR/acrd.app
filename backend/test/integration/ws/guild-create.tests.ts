import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import GuildCreate from '../../../src/ws/ws-events/guild-create';
import { User, UserDocument } from '../../../src/data/models/user';
import { Mock } from '../../mock/mock';
import { expect } from 'chai';
import { GuildMemberDocument } from '../../../src/data/models/guild-member';

describe('guild-create', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  let ws: WebSocket;
  let event: GuildCreate;

  let user: SelfUserDocument;

  beforeEach(async () => {
    ({ ws, event, user } = await Mock.defaultSetup(client, GuildCreate));
  });

  afterEach(async () => Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('user creates guild, fulfilled', async () => {
    await expect(guildCreate()).to.be.fulfilled;
  });

  it('user creates guild, added to user.guilds', async () => {
    const oldCount = user.guildIds.length;
    await guildCreate();

    user = await User.findById(user.id);
    expect(user.guildIds.length).to.be.greaterThan(oldCount);
  });

  function guildCreate(partialGuild?: Partial<Entity.Guild>) {
    return event.invoke(ws, client, {
      name: 'Mock Guild',
      ...partialGuild,
    });
  }
});