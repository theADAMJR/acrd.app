import { Injectable } from '@angular/core';
import { GuildService } from './guild.service';

@Injectable({ providedIn: 'root' })
export class PermissionsService {
  constructor(private guildService: GuildService) {}

  can(guildId: string, required: string) {
    const member = this.guildService.getSelfMember(guildId);
    const role = this.getHighestRole(member);
    // can account for channel permissions too
    const permission = GeneralPermission[required]
      ?? TextChannelPermission[required]
      ?? VoiceChannelPermission[required];

    return this.guildService.ownsGuild(guildId, member.user._id)
      || Boolean(role.permissions & permission);
  }
  getHighestRole(member: any) {
    const roleId = member.roleIds[member.roleIds.length - 1];

    return this.guildService
      .getGuild(member.guildId)?.roles
      .find(r => r._id === roleId);
  }
}

export type Permission = GeneralPermission | TextChannelPermission | VoiceChannelPermission;

export enum GeneralPermission {
  VIEW_CHANNELS = 1024,
  MANAGE_NICKNAMES = 512,
  CHANGE_NICKNAME = 256,
  CREATE_INVITE = 128,
  KICK_MEMBERS = 64,
  BAN_MEMBERS = 32,
  MANAGE_CHANNELS = 16,
  MANAGE_ROLES = 8,
  MANAGE_GUILD = 4,
  VIEW_AUDIT_LOG = 2,
  ADMINISTRATOR = 1
}
export enum TextChannelPermission {
  ADD_REACTIONS = 2048 * 16,
  MENTION_EVERYONE = 2048 * 8,
  READ_MESSAGE_HISTORY = 2048 * 4,
  MANAGE_MESSAGES = 2048 * 2,
  SEND_MESSAGES = 2048
}
export enum VoiceChannelPermission {
  MOVE_MEMBERS = 32768 * 8,
  MUTE_MEMBERS = 32768 * 4,
  SPEAK = 32768 * 2,
  CONNECT = 32768
}
