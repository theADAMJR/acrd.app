import '@accord/types';
import { expect } from 'chai';
import { given, test } from '@accord/ion';
import { SelfUserDocument } from '@accord/backend/data/models/user';
import { generateSnowflake } from '@accord/backend/data/snowflake-entity';
import clearDB from '../util/clear-db';
import emitReady from '../util/emit-ready';
import emitAsync from '../util/emit-async';
import { Channel } from '@accord/backend/data/models/channel';

test(channelCreate, () => {
  const channelId = generateSnowflake();
  const guildId = generateSnowflake();

  let channel: Entity.Channel;
  let guild: Entity.Guild;
  let ownerUser: SelfUserDocument;

  beforeEach(async () => {
    await clearDB();

    ownerUser = await deps.users.create({
      email: 'user1@example.com',
      username: 'Test User',
      password: 'doesnotmatter',
    });
    guild = await deps.guilds.create({
      id: guildId,
      name: 'Test Guild',
      ownerId: ownerUser.id,
    });
    channel = await deps.channels.create({ id: channelId, guildId });

    await emitReady(ownerUser);
  });

  const args = { name: 'test-channel', guildId, type: 'TEXT' };
  // @accord/ion: before tests must go above
  given(args)
    .message('User lacks permissions, rejected')
    .before(setNoobUser)
    .rejectWith('Missing Permissions: MANAGE_CHANNELS');
  given({})
    .message('No args, rejected')
    .rejectWith('Not enough options were provided');
  given(args)
    .message('Valid args, is guild owner, channel created')
    .assert(async (res) =>
      expect({
        channel: (await Channel.findById(channelId)).toJSON(),
        creatorId: ownerUser.id,
        guildId,
      }).to.deep.equal(res));

  async function setNoobUser() {
    const noobUser = await deps.users.create({
      email: 'user2@example.com',
      username: 'Test User 2',
      password: 'doesnotmatter',
    });
    await deps.guildMembers.create({ userId: noobUser.id, guildId });
    await emitReady(noobUser);
  }
});

function channelCreate(args: WS.To['CHANNEL_CREATE']) {
  return emitAsync('CHANNEL_CREATE', args);
}
