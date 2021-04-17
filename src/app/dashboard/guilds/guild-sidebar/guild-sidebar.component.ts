import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions.service';
import { Args, WSService } from 'src/app/services/ws.service';
import { GuildService } from '../../../services/guild.service';
import { CreateInviteComponent } from '../../../dialog/create-invite/create-invite.component';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';
import { PingService } from 'src/app/services/ping.service';
import { CreateChannelComponent } from 'src/app/dialog/create-channel/create-channel.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  @Input('waitFor')
  public loaded = true;
  
  public id: string;
  public guild: Lean.Guild;
  public selectedChannel: Lean.Channel;

  public get textChannels() {
    return this.guild.channels.filter(c => c.type === 'TEXT');
  }
  public get voiceChannels() {
    return this.guild.channels.filter(c => c.type === 'VOICE');
  }

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    public perms: PermissionsService,
    private router: Router,
    private usersService: UsersService,
    private ws: WSService,
    public pings: PingService,
    private dialog: MatDialog,
  ) {}

  public async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      this.id = paramMap.get('guildId');
      const channelId = paramMap.get('channelId');

      this.guild = this.guildService.getGuild(this.id);
      this.selectedChannel = this.guild.channels
        .find(c => c._id === channelId);
      
      if (!this.guild)
        this.router.navigate(['/channels/@me']);
    });

    this.hookWSEvents();
  }

  public hookWSEvents() {
    this.ws
      .once('CHANNEL_CREATE', this.addChannelToGuild, this)
      .once('PRESENCE_UPDATE', this.updateMemberPresence, this)      
      .once('GUILD_UPDATE', this.updateGuild, this)
      .once('GUILD_ROLE_UPDATE', this.updateRole, this)
      .once('GUILD_DELETE', this.delete, this);
  }

  private addChannelToGuild({ channel }: Args.ChannelCreate) {
    this.guild.channels.push(channel);
  }
  private updateMemberPresence({ userId, status }: Args.PresenceUpdate) {
    const guildMember = this.getMember(userId);
    if (!guildMember) return;
    
    const user = this.usersService.getKnown(userId);
    user.status = status;
  }
  private updateGuild({ partialGuild }: Args.GuildUpdate) {
    this.guildService.updateCached(this.guild._id, {
      ...this.guild,
      ...partialGuild,
    });
  }

  private updateRole({ roleId, partialRole }: Args.GuildRoleUpdate) {
    const index = this.guild.roles.findIndex(r => r._id === roleId);
    this.guild.roles[index] = {
      ...this.guild.roles[index],
      ...partialRole,
    };
  }
  private async delete() {
    const index = this.guildService.guilds.findIndex(g => g._id === this.guild._id);
    this.guildService.guilds.splice(index, 1);

    await this.router.navigate(['/channels/@me']);
  }

  private getMember(userId: string) {
    return this.guild.members.find(m => m.userId === userId);
  }

  public toggleMemberList() {
    document
      .querySelector('.member-list').classList
      .toggle('d-none');
  }

  public createInviteDialog() {
    this.dialog.open(CreateInviteComponent, {
      width: '500px',
      data: { guild: this.guild }
    });
  }

  public createChannelDialog() {
    this.dialog.open(CreateChannelComponent, {
      width: '350px',
      data: { guild: this.guild }
    });
  }
}
