import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from '@accord/ion';
import { longString, mongooseError } from '../../test-utils';
import { App } from '../../../src/data/models/app';

test(createApplication, () => {
  given().expect(true);
  given({ _id: null }).expect(true);
  given({ description: '' }).expect('Description is required');
  given({ description: longString(1001) }).expect('Description too long');
  given({ description: 'Very epic' }).expect(true);
  given({ name: '' }).expect('Name is required');
  given({ name: longString(33) }).expect('Name is too long');
  given({ name: 'Epic Bot@' }).expect('Name contains invalid characters');
  given({ name: 'Epic Bot' }).expect(true);
  given({ name: 'Epic-Bot' }).expect(true);
  given({ ownerId: '' }).expect('Owner ID is required');
  given({ ownerId: '123' }).expect('Invalid Snowflake ID');
  given({ ownerId: generateSnowflake() }).expect(true);
  given({ userId: '' }).expect('User ID is required');
  given({ userId: '123' }).expect('Invalid Snowflake ID');
  given({ userId: generateSnowflake() }).expect(true);
});

function createApplication(message: any) {
  const error = new App({
    _id: generateSnowflake(),
    userId: generateSnowflake(),
    ownerId: generateSnowflake(),
    name: 'Epic-Bot',
    description: 'Very epic',
    ...message,
  }).validateSync();

  return mongooseError(error);
}
