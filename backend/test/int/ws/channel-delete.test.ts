import '@accord/types';
import { given, test } from '@accord/ion';
import { Channel } from '@accord/backend/data/models/channel';
import { Guild } from '@accord/backend/data/models/guild';
import ChannelDelete from '@accord/backend/ws/ws-events/channel-delete';
import { WebSocket } from '@accord/backend/ws/websocket';
import { SelfUserDocument, User } from '@accord/backend/data/models/user';

test(channelDelete, () => {
  let channel: Entity.Channel;
  let guild: Entity.Guild;
  let ownerUser: SelfUserDocument;
  
  beforeEach(async () => {
    await Channel.deleteMany();
    await Guild.deleteMany();
    await User.deleteMany();

    ownerUser = await deps.users.create({
      email: 'user1@example.com',
      username: 'Test User',
      password: 'doesnotmatter',
    });
    guild = await deps.guilds.create('Test Guild', ownerUser);
    channel = await deps.channels.create({ guildId: guild.id });
  });

  given({}).rejectWith('Channel not found');
  // given({})
  //   // .before(async () => ownerUser = await deps.users.create({
  //   //   email: 'user2@example.com',
  //   //   username: 'Test User 2',
  //   //   password: 'doesnotmatter',
  //   // }))
  //   .rejectWith('Missing Permissions');
  
  // given({ channelId: generateSnowflake() }).rejectWith('Channel not found');
  // given({ channelId: channel.id }).resolveWith([{
  //   emit: 'CHANNEL_DELETE',
  //   to: channel.id,
  //   send: { channelId: channel.id },
  // }]);
});

async function channelDelete(args: WS.To['CHANNEL_DELETE']) {
  const event = new ChannelDelete();
  return event.invoke(new WebSocket(), {} as any, args);
}

