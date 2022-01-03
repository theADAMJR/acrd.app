import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from '@accord/ion';
import { longString, mongooseError } from '../../test-utils';
import { Role } from '../../../src/data/models/role';
import { PermissionTypes } from '@accord/types';

test(createRole, () => {
  given().expect(true);
  given({ color: '#FFFFFF' }).expect(true);
  given({ color: '' }).expect(true);
  given({ name: '' }).expect('Name is required');
  given({ name: longString(33) }).expect('Name too long');
  given({ name: 'Mock Role' }).expect(true);
  given({ name: '@everyone' }).expect(true);
  given({ permissions: -1 }).expect('Invalid permissions integer');
  given({ permissions: 255 }).expect(true);
  given({ permissions: 4 }).expect(true);
  given({ permissions: 1 }).expect(true);
  given({ permissions: null }).expect('Permissions is required');
  given({ permissions: PermissionTypes.defaultPermissions }).expect(true);
  given({ permissions: 0 }).expect(true);
  given({ position: -1 }).expect('Position must be 0 or greater');
  given({ position: 0 }).expect(true);
});

function createRole(guild: any) {
  const error = new Role({
    _id: generateSnowflake(),
    color: '#FFFFFF',
    guildId: generateSnowflake(),
    hoisted: false,
    mentionable: true,
    name: 'Mock Role',
    permissions: PermissionTypes.defaultPermissions,
    position: 1,
    ...guild,
  }).validateSync();

  return mongooseError(error);
}
