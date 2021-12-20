import { Channel } from '@accord/backend/data/models/channel';
import { Guild } from '@accord/backend/data/models/guild';
import { GuildMember } from '@accord/backend/data/models/guild-member';
import { Role } from '@accord/backend/data/models/role';
import { User } from '@accord/backend/data/models/user';

export default () => Promise.all([
  Channel.deleteMany(),
  Guild.deleteMany(),
  GuildMember.deleteMany(),
  Role.deleteMany(),
  User.deleteMany(),
]);