import { Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { GuildService } from '../../services/guild.service';
import { MatDrawer } from '@angular/material/sidenav';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawer') drawer: MatDrawer;

  get guilds() { return this.guildService.guilds || []; }
  get user() { return this.userService.user || {}; }

  constructor(
    public guildService: GuildService,
    private userService: UsersService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.guildService.init();
  }

  toggle() {
    const icon = document.querySelector('#nav-icon1');
    icon.classList.toggle('open');
    this.drawer.toggle();
  }

  disconnect() {
    const channel = this.guildService.getChannel(this.user.voice.guildId, this.user.voice.channelId);
    const index = channel.members.findIndex(m => m.user._id === this.user._id);
    channel.members.splice(index, 1);

    const guild = this.guildService.getGuild(this.user.voice.guildId);

    this.user.voice.channelId = null;
    this.user.voice.guildId = null;

    
    this.ws.socket.emit('VOICE_CHANNEL_UPDATE', { channel, guild, user: this.user })
    this.ws.socket.emit('VOICE_STATE_UPDATE', { user: this.user });
  }
}
