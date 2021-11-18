import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from '@accord/ion';
import { longString, mongooseError } from '../../test-utils';
import { Guild } from '../../../src/data/models/guild';

test(createGuild, () => {
  given().expect(true);
  given({ name: '' }).expect('Name is required');
  given({ name: 'Mock Guild' }).expect(true);
  given({ name: longString(33) }).expect('Name is too long');
  given({ ownerId: '123' }).expect('Invalid Snowflake ID');
  given({ ownerId: generateSnowflake() }).expect(true);
  given({ systemChannelId: generateSnowflake() }).expect(true);
  given({ systemChannelId: undefined }).expect(true);
  given({ systemChannelId: '123' }).expect('Invalid Snowflake ID');
});

function createGuild(guild: any) {
  const error = new Guild({
    _id: generateSnowflake(),
    name: 'Mock Guild',
    ownerId: generateSnowflake(),
    ...guild
  }).validateSync();

  return mongooseError(error);
}
