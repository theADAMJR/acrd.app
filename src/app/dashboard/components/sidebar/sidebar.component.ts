import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { GuildService } from '../../../services/guild.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Args, WSService } from 'src/app/services/ws.service';
import { RTCService } from 'src/app/services/rtc.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Lean } from 'src/app/types/entity-types';
import { Router } from '@angular/router';
import { SoundService } from 'src/app/services/sound.service';
import { PingService } from 'src/app/services/ping.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  get guilds() { return this.guildService.guilds || []; }
  get user() { return this.userService.user; }

  constructor(
    public channelService: ChannelService,
    public guildService: GuildService,
    private sounds: SoundService,
    private pings: PingService,
    private userService: UsersService,
    private rtc: RTCService,
    private router: Router,
    private ws: WSService,
  ) {}

  async ngOnInit() {
    await this.channelService.init();
    await this.guildService.init();
    
    this.hookWSEvents();
  }

  public hookWSEvents() {
    this.ws
      .on('GUILD_JOIN', this.joinGuild, this)
      .on('MESSAGE_CREATE', this.ping, this);
  }

  public async ping({ message }: Args.MessageCreate) {
    const guild = this.guildService.getGuildFromChannel(message.channelId);
    if (this.pings.isIgnored(message, guild?._id)) return;

    await this.pings.add(message.channelId, message._id);
  }

  public async joinGuild({ guild }: Args.GuildJoin) {
    this.guildService.guilds.push(guild);
    this.router.navigate([`/channels/${guild._id}`]);

    await this.sounds.success();
  }

  public toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }
}
