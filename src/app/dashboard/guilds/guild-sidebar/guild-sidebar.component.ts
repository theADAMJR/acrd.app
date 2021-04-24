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
import { MatMenuTrigger } from '@angular/material/menu';

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
    public usersService: UsersService,
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
      .on('CHANNEL_CREATE', this.addChannel, this)
      .on('CHANNEL_DELETE', this.deleteChannel, this)
      .on('GUILD_DELETE', this.delete, this)
      .on('GUILD_MEMBER_ADD', this.addGuildMember, this)
      .on('GUILD_UPDATE', this.updateGuild, this)
      .on('GUILD_ROLE_UPDATE', this.updateRole, this);  
  }

  private addChannel({ channel }: Args.ChannelCreate) {
    this.guild.channels.push(channel);
  }
  private deleteChannel({ channelId }: Args.ChannelDelete) {
    const index = this.guild.channels.findIndex(c => c._id === channelId);
    this.guild.channels.splice(index, 1);
  }
  private addGuildMember({ member }: Args.GuildMemberAdd) {
    this.guild.members.push(member);
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

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.menu.focusFirstItem('mouse');
    menuTrigger.openMenu();
  }
}
