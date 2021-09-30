import UserUpdate from '../../../src/ws/ws-events/user-update';
import { WebSocket } from '../../../src/ws/websocket';
import io from 'socket.io-client';
import{ Mock } from '../../mock/mock';
import{ SelfUserDocument, User } from '../../../src/data/models/user';
import { expect } from 'chai';
import Deps from '../../../src/utils/deps';
import Users from '../../../src/data/users';

describe.only('user-update', () => {
  const client = (io as any)(`http://localhost:${process.env.PORT}`) as any;

  let event: UserUpdate;
  let ws: WebSocket;
  let user: SelfUserDocument;
  let token: string;

  beforeEach(async () => {
    ({ event, ws, user } = await Mock.defaultSetup(client, UserUpdate));

    regenToken();
  });

  afterEach(async () => await Mock.afterEach(ws));
  after(async () => await Mock.after(client));

  it('client updates user, is fulfilled', async () => {
    await expect(updateUser()).to.be.fulfilled;
  });

  it('client updates user, user is updated', async () => {
    await updateUser();
    
    const newUser = await User.findById(user.id);
    expect(user.username).to.not.equal(newUser.username);
  });

  it('client spoofs token, is rejected', async () => {
    await regenToken('23u8123u12hg31873g183y21ufg321yt3');

    await expect(updateUser()).to.be.rejectedWith('User Not Found');
  });

  it('client maintains username, discriminator not updated', async () => {
    const oldDiscrim = user.discriminator;
    await updateUser();

    user = await User.findById(user.id) as any;
    expect(user.discriminator).to.equal(oldDiscrim);
  });

  it('client changes username, discriminator is updated', async () => {
    await Mock.user({ username: 'testing123' });
    await updateUser({ username: 'testing123' });

    user = await User.findById(user.id) as any;
    await expect(user.discriminator).to.equal(2);
  });

  async function updateUser(options?: Partial<UserTypes.Self>) {
    return event.invoke(ws, client, {
      token,
      avatarURL: 'https://example.com',
      username: 'mock-user',
      discriminator: 1,
      ...options,
    });
  }

  async function regenToken(id = user.id) {
    token = Deps
      .get<Users>(Users)
      .createToken(id, false);
  }
});
