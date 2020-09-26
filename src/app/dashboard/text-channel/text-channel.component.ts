import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import io from 'socket.io-client';
import { environment } from 'src/environments/environment';
import { UsersService } from 'src/app/services/users.service';
import { FormControl, FormGroup } from '@angular/forms';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-text-channel',
  templateUrl: './text-channel.component.html',
  styleUrls: ['./text-channel.component.css']
})
export class TextChannelComponent implements OnInit {
  channel: any;
  guild: any;
  messages = [];
  socket: SocketIOClient.Socket;

  chatBox = new FormControl();

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    private userService: UsersService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.guildService.init();

    const guildId = this.route.snapshot.paramMap.get('guildId');
    const channelId = this.route.snapshot.paramMap.get('channelId');

    this.guild = this.guildService.getGuild(guildId);
    this.channel = this.guild?.channels
      .find(c => c._id === channelId);
    
    document.title = `#${this.channel.name}`;

    this.io();

    this.messages = await this.guildService.getMessages(guildId, channelId);
  }

  chat(content: string) {
    if (!content.trim()) return;
    
    (document.querySelector('#chatBox') as HTMLInputElement).value = '';
    
    this.socket.emit('MESSAGE_CREATE', {
      author: this.userService.user,
      channel: this.channel,
      content,
      guild: this.guild
    });
  }

  io() {
    this.ws.socket.on('MESSAGE_CREATE', (message) => this.messages.push(message));
  }
}
