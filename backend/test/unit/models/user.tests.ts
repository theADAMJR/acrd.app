import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from '@accord/ion';
import { longArray, mongooseError } from '../../test-utils';
import { User } from '../../../src/data/models/user';
import { Mock } from '../../mock/mock';
import { expect } from 'chai';

test(createUser, () => {
  given().expect(true);
  given({ avatarURL: '' }).expect('Avatar URL is required');
  given({ avatarURL: 'a' }).expect(true);
  given({ discriminator: -1 }).expect('Discriminator too low');
  given({ discriminator: 0 }).expect(true);
  given({ discriminator: 9999 }).expect(true);
  given({ discriminator: 10_000 }).expect('Discriminator too high');
  given({ status: '' }).expect('Status is required');
  given({ status: 'A' }).expect('Invalid status');
  given({ status: 'ONLINE' }).expect(true);
  given({ status: 'BUSY' }).expect(true);
  given({ status: 'AFK' }).expect(true);
  given({ status: 'OFFLINE' }).expect(true);
  given({ email: '' }).expect(true);
  given({ email: 'a' }).expect('Invalid email address');
  given({ email: 'a@a' }).expect('Invalid email address');
  given({ email: 'adam@d-cl.one' }).expect(true);
  given({ ignored: null }).expect(true);
  given({ ignored: { channelIds: [] } }).expect(true);
  given({ ignored: { guildIds: [] } }).expect(true);
  given({ ignored: { userIds: [] } }).expect(true);
  given({ _id: '123', ignored: { userIds: ['123'] } }).expect('Cannot block self');
  given({ username: '' }).expect('Username is required');
  given({ username: 'ADAMJR' }).expect(true);
  given({ username: 'ADAM JR' }).expect(true);
  given({ username: 'a' }).expect('Invalid username');
  given({ username: 'ADAM-JR' }).expect(true);

  it('email is taken, rejected', async () => {
    const user = await Mock.self();
    user.email = 'adam@d-cl.one';
    await user.save();

    const user2 = await Mock.self();
    user2.email = 'adam@d-cl.one';

    await expect(user2.validate()).to.be.rejectedWith('expected `email` to be unique');
  });

  after(() => Mock.cleanDB());
});

function createUser(user: any) {
  const error = new User({
    avatarURL: 'a',
    bot: false,
    guilds: [generateSnowflake()],
    status: 'ONLINE',
    username: `mock-user-${generateSnowflake()}`,
    discriminator: 1,
    ...user,
  }).validateSync();

  return mongooseError(error);
}
