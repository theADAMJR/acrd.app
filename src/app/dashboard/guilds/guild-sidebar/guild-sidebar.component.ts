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
import { ChannelService } from 'src/app/services/channel.service';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent {
  @Input('waitFor')
  public loaded = true;
  
  public id: string;
  public guild: Lean.Guild;
  
  public get selectedChannel() {
    return this.channelService.self;
  }

  public get textChannels() {
    return this.guild.channels.filter(c => c.type === 'TEXT');
  }
  public get voiceChannels() {
    return this.guild.channels.filter(c => c.type === 'VOICE');
  }

  constructor(
    public channelService: ChannelService,
    public perms: PermissionsService,
    public usersService: UsersService,
    public pings: PingService,
    private dialog: MatDialog,
  ) {}
  
  private getMember(userId: string) {
    return this.guild.members.find(m => m.userId === userId);
  }

  public createInviteDialog() {
    this.dialog.open(CreateInviteComponent, {
      width: '500px',
      data: { guild: this.guild },
    });
  }

  public createChannelDialog() {
    this.dialog.open(CreateChannelComponent, {
      width: '350px',
      data: { guild: this.guild },
    });
  }

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.menu.focusFirstItem('mouse');
    menuTrigger.openMenu();
  }
}
