import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
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

  chatBox = new FormControl();

  get onlineMembers() {
    return this.guild.members.filter(m => m.user.status !== 'OFFLINE');
  }
  get offlineMembers() {
    console.log(this.guild);
    
    return this.guild.members.filter(m => m.user.status === 'OFFLINE');
  }

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    public userService: UsersService,
    private ws: WSService) {}

  async ngOnInit() {
    await this.userService.init();
    await this.guildService.init();

    const guildId = this.route.snapshot.paramMap.get('guildId');
    const channelId = this.route.snapshot.paramMap.get('channelId');

    this.guild = this.guildService.getGuild(guildId);
    this.channel = this.guild?.channels
      .find(c => c._id === channelId);
    
    document.title = `#${this.channel.name}`;

    this.ws.socket.on('MESSAGE_CREATE', (message) => this.messages.push(message));

    this.messages = await this.guildService.getMessages(guildId, channelId);
  }

  chat(content: string) {
    if (!content.trim()) return;
    
    (document.querySelector('#chatBox') as HTMLInputElement).value = '';
    
    this.ws.socket.emit('MESSAGE_CREATE', {
      author: this.userService.user,
      channel: this.channel,
      content,
      guild: this.guild
    });
  }
}
