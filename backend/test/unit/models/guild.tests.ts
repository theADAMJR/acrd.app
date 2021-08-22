import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from 'sazerac';
import { longArray, longString, mongooseError } from '../../test-utils';
import { Guild } from '../../../src/data/models/guild';

test(createGuild, () => {
  given().expect(true);
  given({ channels: longArray(251) }).expect('Channel limit reached');
  given({ channels: longArray(250) }).expect(true);
  given({ name: '' }).expect('Name is required');
  given({ name: 'Mock Guild' }).expect(true);
  given({ name: longString(33) }).expect('Name is too long');
  given({ ownerId: '123' }).expect('Invalid Snowflake ID');
  given({ ownerId: generateSnowflake() }).expect(true);
  given({ roles: [] }).expect('Guild must have at least one role');
  given({ roles: [generateSnowflake()] }).expect(true);
});

function createGuild(guild: any) {
  const error = new Guild({
    _id: generateSnowflake(),
    name: 'Mock Guild',
    ownerId: generateSnowflake(),
    roles: [generateSnowflake()],
    channels: [
      generateSnowflake(),
      generateSnowflake(),
    ],
    members: [generateSnowflake()],
    ...guild
  }).validateSync();

  return mongooseError(error);
}
