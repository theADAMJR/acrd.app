import { Channel } from '@acrd/backend/data/models/channel';
import { Guild } from '@acrd/backend/data/models/guild';
import { GuildMember } from '@acrd/backend/data/models/guild-member';
import { Role } from '@acrd/backend/data/models/role';
import { User } from '@acrd/backend/data/models/user';

export default () => Promise.all([
  Channel.deleteMany(),
  Guild.deleteMany(),
  GuildMember.deleteMany(),
  Role.deleteMany(),
  User.deleteMany(),
]);