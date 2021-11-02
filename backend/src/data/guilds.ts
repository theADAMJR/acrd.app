import { Guild, GuildDocument } from './models/guild';
import DBWrapper from './db-wrapper';
import { generateSnowflake } from './snowflake-entity';
import Deps from '../utils/deps';
import Channels from './channels';
import GuildMembers from './guild-members';
import Roles from './roles';
import { SelfUserDocument, User, UserDocument } from './models/user';
import { Invite } from './models/invite';
import { APIError } from '../rest/modules/api-error';
import { Channel } from './models/channel';
import { Role } from './models/role';
import { GuildMember } from './models/guild-member';
import Users from './users';

export default class Guilds extends DBWrapper<string, GuildDocument> {
  public async get(id: string | undefined) {
    const guild = await Guild.findById(id);
    if (!guild)
      throw new APIError(404, 'Guild Not Found');
    return guild;
  }

  public async getFromChannel(id: string) {
    return await Guild.findOne({ channels: { $in: id } as any });
  }

  public async create(name: string, owner: SelfUserDocument): Promise<GuildDocument> {    
    const guildId = generateSnowflake();

    const [_, __, ___, guild] = await Promise.all([
      deps.roles.create(guildId, { name: '@everyone' }),
      deps.channels.createText(guildId),
      deps.channels.createVoice(guildId),
      Guild.create({ _id: guildId, name, ownerId: owner.id }),
    ]);
    await deps.guildMembers.create(guildId, owner);
    
    return guild;
  }

  public async getChannels(guildId: string) {
    return await Channel.find({ guildId });
  }
  public async getInvites(guildId: string) {
    return await Invite.find({ guildId });
  }
  public async getMembers(guildId: string) {
    return await GuildMember.find({ guildId });
  }
  public async getRoles(guildId: string) {
    return await Role.find({ guildId });
  }
  public async getUsers(guildId: string) {
    const users = await User.find({ guildIds: guildId });
    return users.map(u => deps.users.secure(u));
  }

  public async getEntities(guildId: string) {
    const [channels, members, roles, users] = await Promise.all([
      this.getChannels(guildId),
      this.getMembers(guildId),
      this.getRoles(guildId),
      this.getUsers(guildId),
    ]);
    return { channels, members, roles, users };
  }
}
