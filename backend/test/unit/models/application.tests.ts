import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from 'sazerac';
import { longString, mongooseError } from '../../test-utils';
import { Application } from '../../../src/data/models/application';

test(createApplication, () => {
  given().expect(true);
  given({ _id: null }).expect(true);
  given({ description: '' }).expect('Description is required');
  given({ description: longString(1001) }).expect('Description too long');
  given({ description: 'Very epic' }).expect(true);
  given({ name: '' }).expect('Name is required');
  given({ name: longString(33) }).expect('Name is too long');
  given({ name: 'Epic Bot' }).expect('Name contains invalid characters');
  given({ name: 'Epic-Bot' }).expect(true);
  given({ owner: '' }).expect('Owner is required');
  given({ owner: '123' }).expect('Invalid Snowflake ID');
  given({ owner: generateSnowflake() }).expect(true);
  given({ user: '' }).expect('User ID is required');
  given({ user: '123' }).expect('Invalid Snowflake ID');
  given({ user: generateSnowflake() }).expect(true);
});

function createApplication(message: any) {
  const error = new Application({
    _id: generateSnowflake(),
    user: generateSnowflake(),
    owner: generateSnowflake(),
    name: 'Epic-Bot',
    description: 'Very epic',
    ...message,
  }).validateSync();

  return mongooseError(error);
}
