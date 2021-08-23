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
import { getNameAcronym } from '../utils/utils';

export default class Guilds extends DBWrapper<string, GuildDocument> {
  constructor(
    private channels = Deps.get<Channels>(Channels),
    private members = Deps.get<GuildMembers>(GuildMembers),
    private roles = Deps.get<Roles>(Roles),
  ) { super(); }

  public async get(id: string | undefined, populate = true) {
    const guild = (populate)
      ? await Guild
        .findById(id)
        ?.populate('members')
        .populate('roles')
        .populate('channels')
        .populate('invites')
        .exec()
      : await Guild.findById(id);
    if (!guild)
      throw new APIError(404, 'Guild Not Found');

    return guild;
  }

  public async getFromChannel(id: string) {
    return await Guild.findOne({ channels: { $in: id } as any });
  }

  public async create(name: string, owner: UserDocument): Promise<GuildDocument> {    
    const guildId = generateSnowflake();
    const everyoneRole = await this.roles.create(guildId, {
      name: '@everyone',
    });

    const guild = await Guild.create({
      _id: guildId,
      name,
      ownerId: owner.id,
      roles: [ everyoneRole ],
      nameAcronym: getNameAcronym(name),
      members: [],
      invites: [],
      channels: [
        await this.channels.createText(guildId),
        await this.channels.createVoice(guildId),
      ],
    });
    await this.members.create(guild, owner, everyoneRole);

    return guild;
  }

  public async invites(guildId: string) {
    return await Invite.find({ guildId });
  }
}
