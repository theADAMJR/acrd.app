import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { UsersService } from 'src/app/services/users.service';
import { FormControl } from '@angular/forms';
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
  typingUsernames = [];
  
  private lastMessage: any;
  private lastTypingEmissionAt = null;

  get onlineMembers() {
    return this.guild.members.filter(m => m.user.status !== 'OFFLINE');
  }
  get offlineMembers() {
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

    this.messages = await this.guildService.getMessages(guildId, channelId);

    this.hookWSEvents();

    setTimeout(() => this.scrollToRecent(), 100);
  }

  hookWSEvents() {
    this.ws.socket.on('TYPING_START', ({ user }) => {
      console.log('GET TYPING_START');

      if (!this.typingUsernames.includes(this.userService.user.username))
        this.typingUsernames.push(user.username);

      setTimeout(() => this.stopTyping(user), 6 * 1000);
    });

    this.ws.socket.on('MESSAGE_CREATE', (message) => {
      console.log('GET MESSAGE_CREATE');

      this.messages.push(message);

      setTimeout(() => this.scrollToRecent(), 100);
    });
    
    this.ws.socket.on('MESSAGE_UPDATE', (message) => {
      console.log('GET MESSAGE_UPDATE');
      let index = this.messages.findIndex(m => m._id === message._id);
      if (message._id !== this.messages[index]._id) return;

      console.log(message);

      this.messages[index].embed = null;
    });
  }

  emitTypingStart() { 
    const sinceLastTyped = new Date().getTime() - this.lastTypingEmissionAt?.getTime();    
    if (sinceLastTyped < 5 * 1000) return;

    console.log('SEND TYPING_START');
    
    this.ws.socket.emit('TYPING_START',
      { channel: this.channel, user: this.userService.user });

    this.lastTypingEmissionAt = new Date();
  }
  private stopTyping(user: any) {
    const index = this.typingUsernames.indexOf(user.username);
    this.typingUsernames.splice(index, 1);
  }

  private scrollToRecent() {
    const messages = document.querySelector('.messages');
    messages.scrollTop = messages.scrollHeight;
  }

  chat(content: string) {
    if (!content.trim()) return;
    
    (document.querySelector('#chatBox') as HTMLInputElement).value = '';
    
    console.log('SEND MESSAGE_CREATE');

    this.ws.socket.emit('MESSAGE_CREATE', {
      author: this.userService.user,
      channel: this.channel,
      content,
      guild: this.guild
    });

    this.stopTyping(this.userService.user);
  }
  
  shouldCombine(message) {
    const isSameAuthor = message.author._id === this.lastMessage?.author._id;
    const duringSameHour = new Date(message.createdAt)
      .getHours() === new Date(this.lastMessage?.createdAt).getHours();
      
    this.lastMessage = message;
    return isSameAuthor && duringSameHour;
  }
}
