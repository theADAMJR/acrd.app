import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-text-channel',
  templateUrl: './text-channel.component.html',
  styleUrls: ['./text-channel.component.css']
})
export class TextChannelComponent implements OnInit {
  channel: any;
  messages: any[];
  socket: SocketIOClient.Socket;

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    private userService: UsersService) {}

  async ngOnInit() {
    await this.guildService.init();

    const guildId = this.route.snapshot.paramMap.get('guildId');
    const channelId = this.route.snapshot.paramMap.get('channelId');

    this.channel = this.guildService
      .getGuild(guildId)?.channels
      .find(c => c._id === channelId);
    
    document.title = `#${this.channel.name}`;

    this.socket = io.connect(environment.endpoint);
    this.io();
  }

  chat(content: string) {
    if (!content.trim()) return;

    this.socket.emit('MESSAGE_CREATE', {
      author: this.userService.user,
      channel: this.channel,
      content
    });
  }

  io() {
    this.socket.on('MESSAGE_CREATE', (message) => this.messages.push(message));
  }
}
