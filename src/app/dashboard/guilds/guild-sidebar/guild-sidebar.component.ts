import { Component, Input, OnInit } from '@angular/core';
import { PermissionsService } from 'src/app/services/permissions.service';
import { GuildService } from '../../../services/guild.service';
import { UsersService } from 'src/app/services/users.service';
import { PingService } from 'src/app/services/ping.service';
import { MatMenuTrigger } from '@angular/material/menu';
import { ChannelService } from 'src/app/services/channel.service';
import { DialogService } from 'src/app/services/dialog.service';
import { ActivatedRoute } from '@angular/router';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  @Input('waitFor') public loaded = true;

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
    public route: ActivatedRoute,
    public channelService: ChannelService,
    public guildService: GuildService,
    public perms: PermissionsService,
    public usersService: UsersService,
    public pings: PingService,
    public dialog: DialogService,
  ) {}

  public async ngOnInit() {
    const guildId = this.route.snapshot.paramMap.get('guildId');    
    this.guild = this.guildService.getCached(guildId);
  }

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.menu.focusFirstItem('mouse');
    menuTrigger.openMenu();
  }
}
