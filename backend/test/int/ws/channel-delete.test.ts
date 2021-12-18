import '@accord/types';
import { Channel } from '../../../src/data/models/channel';
import { Guild } from '../../../src/data/models/guild';
import ChannelDelete from '../../../src/ws/ws-events/channel-delete';
import { given, test } from '@accord/ion';
import { WebSocket } from '../../../src/ws/websocket';
import { User } from '../../../src/data/models/user';

test(channelDelete, () => {
  let channel: Entity.Channel;
  let guild: Entity.Guild;
  let ownerUser: Entity.User;

  beforeEach(async () => {
    ownerUser = await deps.users.create({
      email: 'doesnotmatter@example.com',
      username: 'Test User',
      password: 'doesnotmatter',
    });
    guild = await deps.guilds.create('Test Guild', '');
    channel = await deps.channels.create({ guildId: guild.id });
  });
  after(async () => {
    await Channel.deleteMany();
    await Guild.deleteMany();
    await User.deleteMany();
  });

  given({})
    .before(async () => ownerUser = await User.create({}));
  
  given({}).rejectWith('Channel not found');
  // given({ channelId: generateSnowflake() }).rejectWith('Channel not found');
  given({ channelId: channel.id }).resolveWith([{
    emit: 'CHANNEL_DELETE',
    to: channel.id,
    send: { channelId: channel.id },
  }]);
});

async function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  const event = new ChannelDelete();
  return event.invoke(new WebSocket(), {} as any, args);
}

