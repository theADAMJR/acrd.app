import { PermissionTypes } from '../types/permission-types';
import { getGuild, getGuildRoles } from '../store/guilds';
import { getMember, getSelfMember } from '../store/members';

export class PermsService {
  constructor(private state: Store.AppState) {}

  public can(permission: PermissionTypes.PermissionString, guildId: string) {
    const guild = getGuild(guildId)(this.state);
    if (!guild)
      throw new TypeError('Guild not found');
    
    const member = getSelfMember(guildId)(this.state);
    if (!member)
      throw new TypeError('Member not found');

    return guild.ownerId === member?.userId
      || this.hasPermission(
          this.getTotalPerms(member, guildId),
          PermissionTypes.All[permission] as number
        );
  }
  public getTotalPerms(member: Entity.GuildMember, guildId: string) {
    return getGuildRoles(guildId)(this.state)
      .filter(r => member?.roleIds.includes(r.id))
      .reduce((acc, value) => value.permissions | acc, 0);
  }
  public hasPermission(totalPerms: number, permission: number) {
    return Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);
  }

  public canManage(prereq: PermissionTypes.PermissionString, guildId: string, managedUserId: string) {
    const userMember = getMember(guildId, managedUserId)(this.state);
    if (!userMember) return false;

    return this.can(prereq, guildId)
      && (this.state.auth.user!.id === userMember.userId
      || (this.isHigher(guildId, userMember.roleIds)));
  }

  public canPunish(prereq: PermissionTypes.PermissionString, guildId: string, managedUserId: string) {
    return this.state.auth.user!.id !== managedUserId
      && this.can(prereq, guildId)
      && this.canManage(prereq, guildId, managedUserId);
  }

  public isHigher(guildId: string, roleIds: string[]) {
    const guild = getGuild(guildId)(this.state);
    if (!guild)
      throw new TypeError('Guild not found');

    const member = getSelfMember(guildId)(this.state);
    if (!member)
      throw new TypeError('Member not found');

    const joinedRoles = roleIds.concat(member.roleIds);
    const roles = getGuildRoles(guildId)(this.state)
      .filter(r => joinedRoles.includes(r.id));

    const highestRole = roles[roles.length - 1];
    
    return guild.ownerId === member.userId
      || (member.roleIds.includes(highestRole.id)
      && !roleIds.includes(highestRole.id));
  }
}