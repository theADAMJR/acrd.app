import DBWrapper from './db-wrapper';
import { GuildDocument } from './models/guild';
import { GuildMember, GuildMemberDocument } from './models/guild-member';
import { Role } from './models/role';
import { UserDocument } from './models/user';
import { generateSnowflake } from './snowflake-entity';

export default class GuildMembers extends DBWrapper<string, GuildMemberDocument> {
  public async get(id: string | undefined) {
    const member = await GuildMember.findById(id);
    if (!member)
      throw new TypeError('Guild Member Not Found');
    return member;
  }

  public async getInGuild(guildId: string | undefined, userId: string | undefined) {
    const member = await GuildMember.findOne({ guildId, userId });
    if (!member)
      throw new TypeError('Guild Member Not Found');
    return member;
  }

  public async create(guild: GuildDocument, user: UserDocument, ...roles: Entity.Role[]) {    
    const member = await GuildMember.create({
      _id: generateSnowflake(),
      guildId: guild.id,
      userId: user.id,
      roleIds: (roles.length > 0)
        ? roles.map(r => r.id) 
        : [await this.getEveryoneRoleId(guild.id) as string], 
    });    
    await this.joinGuild(user, guild, member);

    return member;
  }

  private async joinGuild(user: UserDocument, guild: GuildDocument, member: GuildMemberDocument) {
    user.guilds.push(guild as any);
    await user.save();

    guild.members.push(member as any);
    await guild.save();
  }

  private async getEveryoneRoleId(guildId: string) {
    const role = await Role.findOne({ guildId, name: '@everyone' });        
    return role?.id;
  }
}