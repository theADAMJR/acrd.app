import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from '@accord/ion';
import { longString, mongooseError } from '../../test-utils';
import { Message } from '../../../src/data/models/message';

test(createMessage, () => {
  given().expect(true);
  given({ authorId: undefined }).expect(true);
  given({ authorId: '123' }).expect('Invalid Snowflake ID');
  given({ authorId: generateSnowflake() }).expect(true);
  given({ channelId: '' }).expect('Channel ID is required');
  given({ channelId: '123' }).expect('Invalid Snowflake ID');
  given({ channelId: generateSnowflake() }).expect(true);
  given({ content: '' }).expect(true);
  given({ content: 'hi' }).expect(true);
  given({ content: longString(3001) }).expect('Content too long');
  given({ embed: null }).expect(true);
  given({ embed: createEmbed() }).expect(true);
  given({ attachmentURLs: [] }).expect(true);
  given({ attachmentURLs: ['/images/image-not-found.png'] }).expect(true);
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
