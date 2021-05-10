import { Injectable } from '@angular/core';
import { Lean, PermissionTypes } from '../types/entity-types';
import { GuildService } from './api/guild.service';
import { UserService } from './api/user.service';

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
      .filter(r => member?.roleIds.includes(r.id))
      .reduce((acc, value) => value.permissions | acc, 0);
  }
  public hasPermission(totalPerms: number, permission: number) {
    return Boolean(totalPerms & permission)
      || Boolean(totalPerms & PermissionTypes.General.ADMINISTRATOR);
  }

  public canManage(guildId: string, userId: string, permission: PermissionTypes.PermissionString) {
    const userMember = this.guildService.getMember(guildId, userId);
    if (!userMember) return false;

    return this.can(guildId, permission)
      && (this.userService.self.id === userMember.userId
      || (this.isHigher(guildId, userMember.roleIds)));
  }

  public canPunish(guildId: string, userId: string, permission: PermissionTypes.PermissionString) {
    return this.userService.self.id !== userId
      && this.can(guildId, permission)
      && this.canManage(guildId, userId, permission);
  }

  public isHigher(guildId: string, roleIds: string[]) {
    const selfMember = this.guildService.getSelfMember(guildId);
    const guild = this.guildService.getCached(guildId);

    const joinedRoles = roleIds.concat(selfMember.roleIds);
    const roles = guild.roles.filter(r => joinedRoles.includes(r.id));

    const highestRole = roles[roles.length - 1];
    
    return selfMember.userId === guild.ownerId
      || (selfMember.roleIds.includes(highestRole.id)
      && !roleIds.includes(highestRole.id));
  }
}
