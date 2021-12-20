import '@accord/types';
import { expect } from 'chai';
import { given, test } from '@accord/ion';
import { SelfUserDocument } from '@accord/backend/data/models/user';
import { generateSnowflake } from '@accord/backend/data/snowflake-entity';
import clearDB from '../util/clear-db';
import emitReady from '../util/emit-ready';
import emitAsync from '../util/emit-async';
import { Channel } from '@accord/backend/data/models/channel';
import { Guild } from '@accord/backend/data/models/guild';

test(guildCreate, () => {
  let ownerUser: SelfUserDocument;

  beforeEach(async () => {
    await clearDB();

    ownerUser = await deps.users.create({
      email: 'user1@example.com',
      username: 'Test User',
      password: 'doesnotmatter',
    });

    await emitReady(ownerUser);
  });

  given({})
    .message('No args, rejected')
    .rejectWith('Not enough options were provided');
  given({ name: 'Test Guild' })
    .message('Valid args, guild and entities returned')
    .assert(async (res) => {
      const keys = ['guild', 'messages', 'members', 'users', 'roles', 'channels'];
      expect(Object.keys(res)).to.contain(keys);
    });
});

function guildCreate(args: WS.To['GUILD_CREATE']) {
  return emitAsync('GUILD_CREATE', args);
}
