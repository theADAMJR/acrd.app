import { UpdateQuery } from 'mongoose';
import { PermissionTypes } from '@acrd/types';
import DBWrapper from './db-wrapper';
import { hasPermission, Role, RoleDocument } from './models/role';
import { generateSnowflake } from './snowflake-entity';
import { Entity } from '@acrd/types';

export default class Roles extends DBWrapper<string, RoleDocument> {
  public async get(id: string | undefined) {
    const role = await Role.findById(id);
    if (!role)
      throw new TypeError('Role Not Found');
    return role;
  }

  public async getEveryone(guildId: string) {
    return await Role.findOne({ guildId, name: '@everyone' }) as RoleDocument;
  }

  public async memberIsHigher(guild: Entity.Guild, selfMember: Entity.GuildMember, theirRoleIds: string[]) {
    const [myRoles, theirRoles] = await Promise.all([
      Role.find({ _id: { $in: selfMember.roleIds } }),
      Role.find({ _id: { $in: theirRoleIds } }),
    ]);
    const max = (key: string) => (max, val) => (max[key] > val[key]) ? max : val;
    const myHighestRole: Entity.Role = myRoles.reduce(max('position'));
    const theirHighestRole: Entity.Role = theirRoles.reduce(max('position'));

    const selfIsOwner = selfMember.userId === guild.ownerId;
    const selfHasHigherRole = myHighestRole.position > theirHighestRole.position;

    return selfIsOwner || selfHasHigherRole;
  }

  public async hasPermission(guild: Entity.Guild, member: Entity.GuildMember, permission: PermissionTypes.Permission | string) {
    const guildRoles = await Role.find({ guildId: guild.id });
    const totalPerms = guildRoles
      .filter(r => member.roleIds.includes(r.id))
      .reduce((acc, value) => value.permissions | acc, 0);

    const permNumber = (typeof permission === 'string')
      ? PermissionTypes.All[PermissionTypes.All[permission as string]]
      : permission;
    return hasPermission(totalPerms, +permNumber);
  }

  public async create(guildId: string, options?: Partial<Entity.Role>) {
    return Role.create({
      _id: generateSnowflake(),
      guildId,
      mentionable: false,
      hoisted: false,
      name: 'New Role',
      permissions: PermissionTypes.defaultPermissions,
      position: await Role.countDocuments({ guildId }),
      ...options,
    });
  }

  public update(id: string, options: UpdateQuery<RoleDocument>) {
    return Role.updateOne({ _id: id }, options, { runValidators: true });
  }
}
