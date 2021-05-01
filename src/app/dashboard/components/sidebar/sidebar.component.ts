import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { GuildService } from '../../../services/guild.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Args, WSService } from 'src/app/services/ws.service';
import { RTCService } from 'src/app/services/rtc.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Lean } from 'src/app/types/entity-types';
import { ActivatedRoute, Router } from '@angular/router';
import { SoundService } from 'src/app/services/sound.service';
import { PingService } from 'src/app/services/ping.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateGuildComponent } from 'src/app/dialog/create-guild/create-guild.component';
import { LogService } from 'src/app/services/log.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  get guilds() { return this.guildService.guilds || []; }
  get user() { return this.usersService.self; }

  constructor(
    public channelService: ChannelService,
    public guildService: GuildService,
    private pings: PingService,
    private usersService: UsersService,
    private dialog: MatDialog,
  ) {}

  async ngOnInit() {
    await this.channelService.init();
    await this.guildService.init();
  }

  public toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }

  public createGuildDialog() {
    this.dialog.open(CreateGuildComponent, {
      width: '500px',
    });
  }
}
