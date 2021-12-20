import '@accord/types';
import { given, test } from '@accord/ion';
import { SelfUserDocument } from '@accord/backend/data/models/user';
import clearDB from '../util/clear-db';
import emitReady from '../util/emit-ready';
import emitAsync from '../util/emit-async';
import { generateSnowflake } from '@accord/backend/data/snowflake-entity';
import { GuildDocument } from '@accord/backend/data/models/guild';
import setRandomUser from '../util/set-random-user';
import setNoobMember from '../util/set-noob-member';

test(guildCreate, () => {
  const guildId = generateSnowflake();
  
  let ownerUser: SelfUserDocument;
  let guild: GuildDocument;

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
  
  given({ guildId })
    .message('Guild exists, is noob member, rejected')
    .before(setNoobMember)
    .rejectWith('Only the guild owner can do this');
  given({ guildId })
    .message('Guild exists, is random user, rejected')
    .before(setRandomUser)
    .rejectWith('Only the guild owner can do this');
  given({})
    .message('No args, rejected')
    .rejectWith('Not enough options were provided');
  given({ guildId })
    .message('Guild exists, is deleted, returns guildId')
    .resolveWith({ guildId });
});

function guildCreate(args: WS.To['GUILD_CREATE']) {
  return emitAsync('GUILD_CREATE', args);
}
