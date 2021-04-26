import { Injectable, Type } from '@angular/core';
import { PermissionTypes } from '../types/entity-types';
import { GuildService } from './guild.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(private guildService: GuildService) {}

  public async can(guildId: string, permission: PermissionTypes.PermissionString) {
    const guild = this.guildService.getGuild(guildId);
    if (!guild)
      throw new TypeError('Guild Not Found');

    const member = this.guildService.getSelfMember(guildId);
    if (!member) return false;

    const totalPerms = guild.roles
      .filter(r => member.roleIds.includes(r._id))
      .reduce((acc, value) => value.permissions | acc, 0);    
      
    return this.hasPermission(totalPerms, PermissionTypes.All[permission] as number);
  }
  public hasPermission(totalPerms: number, permission: number) {
    return Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);
  }
}
