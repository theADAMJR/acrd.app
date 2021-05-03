import { Injectable } from '@angular/core';
import { Lean, PermissionTypes } from '../types/entity-types';
import { GuildService } from './guild.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(
    private guildService: GuildService,
  ) {}

  public can(guildId: string, permission: PermissionTypes.PermissionString) {
    if (!guildId)
      throw new TypeError('Guild ID undefined');
      const guild = this.guildService.getCached(guildId);

    const member = this.guildService.getSelfMember(guildId);
    const totalPerms = guild.roles
      .filter(r => member?.roleIds.includes(r._id))
      .reduce((acc, value) => value.permissions | acc, 0);
      
    return guild.ownerId == member?.userId
      || this.hasPermission(totalPerms, PermissionTypes.All[permission] as number);
  }
  public hasPermission(totalPerms: number, permission: number) {
    return Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);
  }

  public canManage(guildId: string, userId: string) {
    const selfMember = this.guildService.getSelfMember(guildId);
    const userMember = this.guildService.getMember(guildId, userId);

    return selfMember._id !== userMember._id
      && this.isHigher(guildId, selfMember.roleIds, userMember.roleIds);
  }

  public async isHigher(guildId: string, firstRoleIds: string[], secondRoleIds: string[]) {
    const uniqueIds = Array.from(new Set(firstRoleIds.concat(secondRoleIds)));
    const guild = this.guildService.getCached(guildId);

    const highestRole: Lean.Role = guild.roles
      .filter(r => uniqueIds.includes(r._id))
      .sort((a, b) => (a.position > b.position) ? 1 : -1)[0];

    return firstRoleIds.includes(highestRole?._id);
  }

}
