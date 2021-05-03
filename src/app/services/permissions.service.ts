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
    if (!guildId)
      throw new TypeError('Guild ID undefined');

    const guild = this.guildService.getCached(guildId);
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

  public canManage(guildId: string, userId: string) {
    const selfMember = this.guildService.getSelfMember(guildId);
    const userMember = this.guildService.getMember(guildId, userId);

    return this.isHigher(guildId, selfMember.roleIds, userMember.roleIds);
  }

  public canPunish(guildId: string, userId: string, permission: PermissionTypes.PermissionString) {
    return this.userService.self._id !== userId
      && this.can(guildId, permission)
      && this.canManage(guildId, userId);
  }

  public isHigher(guildId: string, firstRoleIds: string[], secondRoleIds: string[]) {
    const uniqueIds = Array.from(new Set(firstRoleIds.concat(secondRoleIds)));
    const guild = this.guildService.getCached(guildId);

    const highestRole: Lean.Role = guild.roles
      .filter(r => uniqueIds.includes(r._id))
      .sort((a, b) => (a.position > b.position) ? 1 : -1)[0];

    return firstRoleIds.includes(highestRole?._id);
  }

}
