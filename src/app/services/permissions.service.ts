import { Injectable } from '@angular/core';
import { Lean } from '../types/entity-types';
import { GuildService } from './guild.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(private guildService: GuildService) {}

  public async can(guildId: string, required: string) {
    const member = this.guildService.getSelfMember(guildId);

    // memberRoles -> permissions

    // const totalPerms = (await Role
    //   .find({ _id: { $in: member.roleIds } }))
    //   .reduce((acc, value) => value.permissions | acc, 0);
      
    // return this.hasPermission(totalPerms, 
    //   GeneralPermission[required]
    //   || TextChannelPermission[required]
    //   || VoiceChannelPermission[required])
    //   || this.guildService.ownsGuild(guildId, member.userId);
    return true;
  }
  public hasPermission(totalPerms: number, permission: number) {
    // return Boolean(totalPerms & permission)
    //   || Boolean(totalPerms & GeneralPermission.ADMINISTRATOR);
  }

  getRoles(member: Lean.GuildMember) {
    const roleId = member.roleIds[member.roleIds.length - 1];

    return this.guildService
      .getGuild(member.guildId)?.roles
      .find(r => r._id === roleId);
  }
}
