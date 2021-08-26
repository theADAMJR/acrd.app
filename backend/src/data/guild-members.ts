import DBWrapper from './db-wrapper';
import { GuildDocument } from './models/guild';
import { GuildMember, GuildMemberDocument } from './models/guild-member';
import { Role } from './models/role';
import { SelfUserDocument, UserDocument } from './models/user';
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

  public async create(guildId: string, user: SelfUserDocument, ...roleIds: string[] = []) {    
    const member = await GuildMember.create({
      _id: generateSnowflake(),
      guildId: guildId,
      userId: user.id,
      roleIds: [await this.getEveryoneRoleId(guildId)].concat(roleIds), 
    });    
    await this.addToUser(user, guildId);

    return member;
  }

  private async addToUser(user: SelfUserDocument, guildId: string) {
    user.guildIds.push(guildId);
    await user.save();
  }

  private async getEveryoneRoleId(guildId: string) {
    const role = await Role.findOne({ guildId, name: '@everyone' });        
    return role!.id;
  }
}