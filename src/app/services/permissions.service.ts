import { Injectable } from '@angular/core';
import { Lean, PermissionTypes } from '../types/entity-types';
import { GuildService } from './guild.service';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(
    private guildService: GuildService,
    private userService: UserService,
  ) {}

  public can(guildId: string, permission: PermissionTypes.PermissionString) {
    const guild = this.guildService.getCached(guildId);
    if (!guild)
      throw new TypeError('Guild Not Found');

    const member = this.guildService.getSelfMember(guildId);
      
    return guild.ownerId == member?.userId
      || this.hasPermission(
          this.getTotalPerms(guild, member),
          PermissionTypes.All[permission] as number
        );
  }
  public getTotalPerms(guild: Lean.Guild, member: Lean.GuildMember) {
    return guild.roles
      .filter(r => member?.roleIds.includes(r._id))
      .reduce((acc, value) => value.permissions | acc, 0);
  }
  public hasPermission(totalPerms: number, permission: number) {
    return Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);
  }

  public canManage(guildId: string, userId: string, permission: PermissionTypes.PermissionString) {
    const userMember = this.guildService.getMember(guildId, userId);
    if (!userMember) return false;

    return this.userService.self._id === userMember.userId
      || (this.isHigher(guildId, userMember.roleIds)
      && this.can(guildId, permission));
  }

  public canPunish(guildId: string, userId: string, permission: PermissionTypes.PermissionString) {
    return this.userService.self._id !== userId
      && this.can(guildId, permission)
      && this.canManage(guildId, userId, permission);
  }

  public isHigher(guildId: string, roleIds: string[]) {
    const selfMember = this.guildService.getSelfMember(guildId);
    const guild = this.guildService.getCached(guildId);

    const highestRole: Lean.Role = guild.roles[guild.roles.length - 1];
      
    return selfMember.userId === guild.ownerId
      || (selfMember.roleIds.includes(highestRole?._id)
      && !roleIds.includes(highestRole._id));
  }
}
