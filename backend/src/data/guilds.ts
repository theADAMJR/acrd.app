import { Guild, GuildDocument } from './models/guild';
import DBWrapper from './db-wrapper';
import { generateSnowflake } from './snowflake-entity';
import Deps from '../utils/deps';
import Channels from './channels';
import GuildMembers from './guild-members';
import Roles from './roles';
import { UserDocument } from './models/user';
import { Invite } from './models/invite';
import { APIError } from '../api/modules/api-error';
import { Channel } from './models/channel';
import { Role } from './models/role';
import { GuildMember } from './models/guild-member';

export default class Guilds extends DBWrapper<string, GuildDocument> {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private members = Deps.get<GuildMembers>(GuildMembers),
    private roles = Deps.get<Roles>(Roles),
  ) { super(); }

  public async get(id: string | undefined) {
    const guild = await Guild.findById(id);
    if (!guild)
      throw new APIError(404, 'Guild Not Found');
    return guild;
  }

  public async getFromChannel(id: string) {
    return await Guild.findOne({ channels: { $in: id } as any });
  }

  public async create(name: string, owner: UserDocument): Promise<GuildDocument> {
    const guild = await Guild.create({
      _id: generateSnowflake(),
      name,
      ownerId: owner.id,
    });
    const everyoneRole = await this.roles.create(guild.id, { name: '@everyone' });
    await this.channels.createText(guild.id);
    await this.members.create(guild, owner, everyoneRole);

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
}
