import '@accord/types';
import { given, test } from '@accord/ion';
import { Channel } from '@accord/backend/data/models/channel';
import { Guild } from '@accord/backend/data/models/guild';
import { SelfUserDocument, User } from '@accord/backend/data/models/user';
import { generateSnowflake } from '@accord/backend/data/snowflake-entity';
import io from 'socket.io-client';

const socket = (io as any).connect(process.env.ROOT_ENDPOINT, {
  secure: true,
  path: `/ws`,
  transports: ['websocket', 'polling', 'flashsocket'],
});
socket.io.on('open', () => console.log('Connected to WS Server'));

test(channelDelete, () => {
  const channelId = generateSnowflake();
  const guildId = generateSnowflake();

  let channel: Entity.Channel;
  let guild: Entity.Guild;
  let ownerUser: SelfUserDocument;

  beforeEach(async function () {
    await Promise.all([
      Channel.deleteMany(),
      Guild.deleteMany(),
      User.deleteMany(),
    ]);  

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

    const token = await deps.users.createToken(ownerUser);
    socket.emit('READY', { token });
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
    const token = await deps.users.createToken(randomUser);
    socket.emit('READY', { token });
  }
});

function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  return new Promise((resolve, reject) => {
    socket.on('CHANNEL_DELETE', (res) => resolve(res));
    socket.on('error', (error) => reject(error));
    socket.emit('CHANNEL_DELETE', args);
  });
}
