import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from 'sazerac';
import { longArray, longString, mongooseError } from '../../test-utils';
import { Message } from '../../../src/data/models/message';

test(createMessage, () => {
  given().expect(true);
  given({ authorId: '' }).expect('Author ID is required');
  given({ authorId: '123' }).expect('Invalid Snowflake ID');
  given({ authorId: generateSnowflake() }).expect(true);
  given({ channelId: '' }).expect('Channel ID is required');
  given({ channelId: '123' }).expect('Invalid Snowflake ID');
  given({ channelId: generateSnowflake() }).expect(true);
  given({ content: '' }).expect('Content too short');
  given({ content: longString(3001) }).expect('Content too long');
  given({ content: 'hi' }).expect(true);
  given({ embed: null }).expect(true);
  given({ embed: createEmbed() }).expect(true);
});

function createMessage(message: any) {
  const error = new Message({
    _id: generateSnowflake(),
    authorId: generateSnowflake(),
    channelId: generateSnowflake(),
    content: 'hi',
    ...message,
  }).validateSync();

  return mongooseError(error);
}

function createEmbed(embed?: any) {
  return {
    description: 'Cool embed',
    image: 'Cool image',
    title: 'Cool title',
    url: 'https://example.com',
    ...embed,
  };
}
