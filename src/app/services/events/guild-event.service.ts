import { Injectable } from '@angular/core';
import { Args } from 'src/app/types/ws-types';
import { GuildService } from '../guild.service';
import { WSService } from '../ws.service';

@Injectable({
  providedIn: 'root'
})
export class GuildEventService {
  constructor(
    private guildService: GuildService,
  ) {}

  public updateRole({ guildId, roleId, partialRole }: Args.GuildRoleUpdate) {
    const guild = this.guildService.getGuild(guildId);
    const index = guild.roles.findIndex(r => r._id === roleId);
    guild.roles[index] = {
      ...guild.roles[index],
      ...partialRole,
    };
  }

  public updateMember({ guildId, partialMember, memberId }: Args.GuildMemberUpdate) {
    const guild = this.guildService.getGuild(guildId);
    const oldMember = this.guildService.getMember(guildId, memberId);
    const index = guild.members.indexOf(oldMember);

    return guild.members[index] = { ...oldMember, ...partialMember };
  }
}
