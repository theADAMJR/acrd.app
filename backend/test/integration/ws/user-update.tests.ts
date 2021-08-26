import UserUpdate from '../../../src/ws/ws-events/user-update';
import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import { Mock } from '../../mock/mock';
import { User, UserDocument } from '../../../src/data/models/user';
import { expect } from 'chai';
import Deps from '../../../src/utils/deps';
import Users from '../../../src/data/users';

describe('user-update', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;
  let event: UserUpdate;
  let ws: WebSocket;

  let user: UserDocument;
  let key: string;

  beforeEach(async () => {
    ({ event, ws, user } = await Mock.defaultSetup(client, UserUpdate));

    regenToken();
  });

  afterEach(async () => {
    await user.deleteOne();
    await Mock.afterEach(ws);
  });
  after(async () => await Mock.after(client));

  it('client updates user, fulfilled', async () => {
    await expect(updateUser()).to.be.fulfilled;
  });

  it('client updates user, user is updated', async () => {
    await updateUser();
    
    const newUser = await User.findById(user.id);
    expect(user.username).to.not.equal(newUser.username);
  });

  it('client is impostor, rejected', async () => {
    await regenToken('23u8123u12hg31873g183y21ufg321yt3');

    await expect(updateUser()).to.be.rejectedWith('User Not Found');
  });

  it('contains banned keys, rejected', async () => {
    await expect(updateUser({ id: '123' })).to.be.rejectedWith('Contains readonly values');
  });

  it('reorders guilds correctly, fulfilled', async () => {
    const guildIds = user.guilds.map(g => g.id);
    await expect(updateUser({ guilds: guildIds as any })).to.be.fulfilled;
  });

  it('reorders guilds but adds, rejected', async () => {
    const newGuild = await Mock.guild();
    const guildIds = (user.guilds as any).concat(newGuild).map(g => g.id);

    await expect(updateUser({ guilds: guildIds as any })).to.be('Cannot add or remove guilds this way');
  });

  it('reorders guilds but removes, rejected', async () => {
    await expect(updateUser({ guilds: [] })).to.be('Cannot add or remove guilds this way');
  });

  async function updateUser(options?: Partial<UserTypes.Self>) {
    return event.invoke(ws, client, {
      key,
      partialUser: {
        avatarURL: 'https://example.com',
        username: 'mock-user',
        ...options,
      },
    });
  }

  async function regenToken(id = user.id) {
    key = Deps
      .get<Users>(Users)
      .createToken(id, false);
  }
});
