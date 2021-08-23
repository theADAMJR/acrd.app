import { Channel } from '../../../src/data/models/channel';
import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from 'sazerac';
import { longArray, longString, mongooseError } from '../../test-utils';


test(createChannel, () => {
  given().expect(true);
  given({ guildId: '123' }).expect('Invalid Snowflake ID');
  given({ guildId: generateSnowflake() }).expect(true);
  given({ memberIds: longArray(51) }).expect('Channel member limit reached');
  given({ memberIds: longArray(49) }).expect(true);
  given({ guildId: null }).expect(true);
  given({ guildId: '123' }).expect('Invalid Snowflake ID');
  given({ guildId: generateSnowflake() }).expect(true);
  given({ name: '' }).expect('Name is required');
  given({ name: longString(33) }).expect('Name too long');
  given({ name: 'channel-name' }).expect(true);
  given({ name: 'channel name', type: 'TEXT' }).expect('Invalid name');
  given({ name: 'channel name', type: 'VOICE' }).expect(true);
  given({ name: 'channel name', type: 'DM' }).expect(true);
  given({ summary: longString(129) }).expect('Summary too long');
  given({ summary: 'cool channel' }).expect(true);
  given({ type: 'A' }).expect('Invalid type');
  given({ type: 'TEXT' }).expect(true);
  given({ type: 'VOICE' }).expect(true);
  given({ type: 'DM' }).expect(true);
  given({ lastMessageId: generateSnowflake() }).expect(true);
  given({ lastMessageId: '' }).expect(true);
  given({ lastMessageId: '123' }).expect('Invalid Snowflake ID');
});

function createChannel(channel: Partial<Entity.Channel>) {
  const error = new Channel({
    _id: generateSnowflake(),
    name: `mock-channel`,
    summary: 'Cool channel, I guess...',
    type: 'TEXT',
    ...channel,
  }).validateSync();

  return mongooseError(error);
}
