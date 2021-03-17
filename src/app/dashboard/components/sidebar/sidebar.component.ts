import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { GuildService } from '../../../services/guild.service';
import { MatDrawer } from '@angular/material/sidenav';
import { Args, WSEventArgs, WSService } from 'src/app/services/ws.service';
import { LogService } from 'src/app/services/log.service';
import { RTCService } from 'src/app/services/rtc.service';
import { ChannelService } from 'src/app/services/channel.service';
import { Lean } from 'src/app/types/entity-types';

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
    private userService: UsersService,
    private log: LogService,
    private rtc: RTCService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.channelService.init();
    await this.guildService.init();
    
    this.hookWSEvents();
  }

  hookWSEvents() {
    this.ws
      .on('ACCEPT_FRIEND_REQUEST', ({ sender, friend, dmChannel }) => {
        this.channelService.dmChannels.push(dmChannel);
        this.updateFriends({ sender, friend });
      }, this)

      .on('GUILD_MEMBER_ADD', async ({ member }) => {
        if (member.userId !== this.user._id) return;
        
        await this.guildService.updateGuilds();
      }, this)

      .on('GUILD_JOIN', async ({ guild }) => {
        this.guildService.guilds.push(guild);
      }, this)

      .on('SEND_FRIEND_REQUEST', ({ sender, friend }) => {
        this.userService.addKnownUser(friend);
        this.updateFriends({ sender, friend });
      }, this)

      .on('REMOVE_FRIEND', this.updateFriends, this)
      .on('CANCEL_FRIEND_REQUEST', this.updateFriends, this);
  }

  updateFriends({ sender, friend }: { sender: Lean.User, friend: Lean.User }) {
    this.userService.upsertCached(sender._id, sender);
    this.userService.upsertCached(friend._id, friend);
  }

  toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }

  async disconnect() {
    this.ws.emit('VOICE_STATE_UPDATE', {
      userId: this.user._id,
      voice: {
        ...this.user.voice,
        channelId: null,
        guildId: null
      },
    });

    this.rtc.hangUp();
  }

  mute() {
    this.user.voice.selfMuted = !this.user.voice.selfMuted;
    (this.user.voice.selfMuted)
      ? this.rtc.muteMicrophone()
      : this.rtc.unmuteMicrophone();

    this.ws.emit('VOICE_STATE_UPDATE', {
      voice: this.user.voice,
      userId: this.user._id
    });
  }
}
