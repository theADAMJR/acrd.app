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
    private notifications: PingService,
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
      .once('GUILD_JOIN', this.joinGuild, this)
      .once('MESSAGE_CREATE', this.sendNotification, this);
  }

  public async sendNotification({ message }: Args.MessageCreate) {
    if (message.authorId === this.user._id) return;

    await this.notifications.add(message.channelId, message._id);
  }

  public async joinGuild({ guild }: Args.GuildJoin) {
    this.guildService.guilds.push(guild);
    this.router.navigate([`/channels/${guild._id}`]);

    await this.sounds.success();
    document.querySelector('.modal-backdrop')?.remove();
  }

  public toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }

  public async disconnect() {
    this.ws.emit('VOICE_STATE_UPDATE', {
      voice: {
        ...this.user.voice,
        channelId: null,
        guildId: null
      },
    });

    this.rtc.hangUp();
  }

  public mute() {
    this.user.voice.selfMuted = !this.user.voice.selfMuted;
    (this.user.voice.selfMuted)
      ? this.rtc.muteMicrophone()
      : this.rtc.unmuteMicrophone();

    this.ws.emit('VOICE_STATE_UPDATE', {
      voice: this.user.voice,
    });
  }
}
