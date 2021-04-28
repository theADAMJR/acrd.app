import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Args } from 'src/app/types/ws-types';
import { ChannelService } from '../channel.service';
import { GuildService } from '../guild.service';
import { WSService } from '../ws.service';

@Injectable({
  providedIn: 'root'
})
export class GuildEventService {
  public get activeGuild() {
    const guildId = this.route.snapshot.paramMap.get('guildId');
    return this.guildService.getGuild(guildId);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private channelService: ChannelService,
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

  public addMember({ member }: Args.GuildMemberAdd) {
    const guild = this.guildService.getGuild(member.guildId);
    guild.members.push(member);
  }
  
  public updateMember({ guildId, partialMember, memberId }: Args.GuildMemberUpdate) {
    const guild = this.guildService.getGuild(guildId);
    const oldMember = this.guildService.getMember(guildId, memberId);
    const index = guild.members.indexOf(oldMember);

    return guild.members[index] = { ...oldMember, ...partialMember };
  }

  public addChannel({ channel }: Args.ChannelCreate) {
    const guild = this.guildService.getGuild(channel.guildId);
    guild.channels.push(channel);
  }
  public deleteChannel({ guildId, channelId }: Args.ChannelDelete) {
    const guild = this.guildService.getGuild(guildId);
    const index = guild.channels.findIndex(c => c._id === channelId);

    guild.channels.splice(index, 1);
  }

  public update({ guildId, partialGuild }: Args.GuildUpdate) {
    const guild = this.guildService.getGuild(guildId);

    this.guildService.updateCached(guildId, {
      ...guild,
      ...partialGuild,
    });
  }
  
  public async delete({ guildId }: Args.GuildDelete) {
    const index = this.guildService.guilds.findIndex(g => g._id === guildId);
    this.guildService.guilds.splice(index, 1);

    const isActive = this.activeGuild._id == guildId;
    if (isActive)
      await this.router.navigate(['/channels/@me']);
  }
}
