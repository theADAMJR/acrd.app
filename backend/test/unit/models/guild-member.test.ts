import { generateSnowflake } from '../../../src/data/snowflake-entity';
import { test, given } from '@accord/ion';
import { mongooseError } from '../../test-utils';
import { GuildMember } from '../../../src/data/models/guild-member';

test(createGuildMember, () => {
  given().expect(true);
  given({ guildId: '' }).expect('Guild ID is required');
  given({ guildId: '123' }).expect('Invalid Snowflake ID');
  given({ guildId: generateSnowflake() }).expect(true);
  given({ userId: '' }).expect('User ID is required');
  given({ userId: '123' }).expect('Invalid Snowflake ID');
  given({ userId: generateSnowflake() }).expect(true);
  given({ roleIds: null }).expect('Role IDs is required');
  given({ roleIds: [] }).expect('At least 1 role is required');
  given({ roleIds: [generateSnowflake()] }).expect(true);
});

function createGuildMember(member: any) {
  const error = new GuildMember({
    _id: generateSnowflake(),
    guildId: generateSnowflake(),
    userId: generateSnowflake(),
    roleIds: [generateSnowflake()],
    ...member,
  }).validateSync();

  return mongooseError(error);
}
