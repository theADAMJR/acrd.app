import DBWrapper from './db-wrapper';

import { hasPermission, Role, RoleDocument } from './models/role';
import { generateSnowflake } from './snowflake-entity';

export default class Roles extends DBWrapper<string, RoleDocument> {
  public async get(id: string | undefined) {
    const role = await Role.findById(id);
    if (!role)
      throw new TypeError('Role Not Found');
    return role;
  }

  public async isHigher(guild: Entity.Guild, selfMember: Entity.GuildMember, roleIds: string[]) {
    const highestRole: Entity.Role = guild.roles[guild.roles.length - 1];

    return selfMember.userId === guild?.ownerId
      || (selfMember.roleIds.includes(highestRole?.id)
      && !roleIds.includes(highestRole.id));
  }

  public async hasPermission(guild: Entity.Guild, member: Entity.GuildMember, permission: PermissionTypes.PermissionString) {
    const totalPerms = guild.roles
      .filter(r => member.roleIds.includes(r.id))
      .reduce((acc, value) => value.permissions | acc, 0);    

    const permNumber = (typeof permission === 'string')
      ? PermissionTypes.All[PermissionTypes.All[permission as string]]
      : permission;    
    return hasPermission(totalPerms, permNumber as any);
  }

  public create(guildId: string, options?: PartialEntity.Role) {
    return Role.create({
      _id: generateSnowflake(),
      guildId,
      mentionable: false,
      hoisted: false,
      name: 'New Role',
      permissions: PermissionTypes.defaultPermissions,
      ...options,
    });
  }
}