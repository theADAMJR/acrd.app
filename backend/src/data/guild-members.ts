import { Entity } from '@accord/types';
import { UpdateQuery } from 'mongoose';
import DBWrapper from './db-wrapper';
import { GuildMember, GuildMemberDocument } from './models/guild-member';
import { Role } from './models/role';
import { User } from './models/user';
import { generateSnowflake } from './snowflake-entity';

export default class GuildMembers extends DBWrapper<string, GuildMemberDocument> {
  public async get(id: string | undefined) {
    const member = await GuildMember.findById(id);
    if (!member)
      throw new TypeError('Guild member not found');
    return member;
  }

  public async getInGuild(guildId: string | undefined, userId: string | undefined) {
    const member = await GuildMember.findOne({ guildId, userId });
    if (!member)
      throw new TypeError('Guild member not found');
    return member;
  }

  public async create(options: Partial<Entity.GuildMember>) {    
    const member = await GuildMember.create({
      _id: options.id ?? generateSnowflake(),
      roleIds: [await this.getEveryoneRoleId(options.guildId!)],
      ...options,
    });    
    await this.addGuildToUser(options.userId!, options.guildId!);
    return member;
  }

  private async addGuildToUser(userId: string, guildId: string) {
    await User.updateOne({ _id: userId }, { $push: { guildIds: guildId } });
  }

  private async getEveryoneRoleId(guildId: string) {
    const role = await Role.findOne({ guildId, name: '@everyone' });        
    return role!.id;
  }

  public async update(memberId: string, options: UpdateQuery<GuildMemberDocument>) {
    return await GuildMember.updateOne(
      { _id: memberId },
      options,
      { runValidators: true },
    );
  }
}