import '@accord/types';
import { given, test } from '@accord/ion';
import { SelfUserDocument } from '@accord/backend/data/models/user';
import { generateSnowflake } from '@accord/backend/data/snowflake-entity';
import clearDB from '../util/clear-db';
import emitReady from '../util/emit-ready';
import emitAsync from '../util/emit-async';

test(channelDelete, () => {
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

  // @accord/ion: before tests must go above
  given({ channelId })
    .message('Channel exists, user is not in guild')
    .before(setRandomUser)
    .rejectWith('Guild member not found');

  given({})
    .message('No args, rejected')
    .rejectWith('Channel not found');
  given({ channelId: generateSnowflake() })
    .message('Non existing channel, rejected')
    .rejectWith('Channel not found');
  given({ channelId })
    .message('Channel exists, user is guild owner')
    .resolveWith({ channelId, guildId });

  async function setRandomUser() {
    const randomUser = await deps.users.create({
      email: 'user2@example.com',
      username: 'Test User 2',
      password: 'doesnotmatter',
    });
    await emitReady(randomUser);
  }
});

function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  return emitAsync('CHANNEL_DELETE', args);
}
