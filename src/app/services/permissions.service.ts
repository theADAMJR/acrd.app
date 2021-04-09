import { Injectable } from '@angular/core';
import { PermissionTypes } from '../types/entity-types';
import { GuildService } from './guild.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(private guildService: GuildService) {}

  public async can(guildId: string, permission: PermissionTypes.PermissionString) {
    const roles = this.guildService.getGuild(guildId)?.roles;
    if (!roles) return;

    const member = this.guildService.getSelfMember(guildId);

    const totalPerms = roles
      .filter(r => member.roleIds.includes(r._id))
      .reduce((acc, value) => value.permissions | acc, 0);    
      
    return this.hasPermission(totalPerms, PermissionTypes.All[permission] as number);
  }
  public hasPermission(totalPerms: number, permission: number) {
    return Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);
  }
}
