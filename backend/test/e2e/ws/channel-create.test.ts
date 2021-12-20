import '@accord/types';
import { expect } from 'chai';
import { given, test } from '@accord/ion';
import { SelfUserDocument } from '@accord/backend/data/models/user';
import { generateSnowflake } from '@accord/backend/data/snowflake-entity';
import { Channel } from '@accord/backend/data/models/channel';
import clearDB from '../util/clear-db';
import emitReady from '../util/emit-ready';
import emitAsync from '../util/emit-async';
import setNoobMember from '../util/set-noob-member';

test(channelCreate, () => {
  const guildId = generateSnowflake();

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

    await emitReady(ownerUser);
  });

  const args = { name: 'test-channel', guildId, type: 'TEXT' };
  // @accord/ion: before tests must go above
  given(args)
    .message('User lacks permissions, rejected')
    .before(setNoobMember)
    .rejectWith('Missing Permissions: MANAGE_CHANNELS');
  given({})
    .message('No args, rejected')
    .rejectWith('Not enough options were provided');
  given(args)
    .message('Valid args, is guild owner, guild channel created')
    .assert(async (res) =>
      expect(await Channel.count({ guildId })).to.equal(2));
});

function channelCreate(args: WS.To['CHANNEL_CREATE']) {
  return emitAsync('CHANNEL_CREATE', args);
}
