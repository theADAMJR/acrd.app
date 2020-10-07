import { Component, Input } from '@angular/core';
import { toHTML } from 'discord-markdown';
import { textEmoji } from 'markdown-to-text-emoji';
import { LogService } from 'src/app/services/log.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'message-preview',
  templateUrl: './message-preview.component.html',
  styleUrls: ['./message-preview.component.css']
})
export class MessagePreviewComponent {
  @Input() message: any;
  @Input() isExtra = false;

  embed: MessageEmbed;

  get timestamp() {
    const createdAt = new Date(this.message.createdAt ?? new Date());
    const timestamp = new Date()
      .toTimeString()
      .slice(0, 5);

    const wasToday = new Date().getDay() / createdAt.getDay() === 1;
    const wasYesterday = new Date().getDate() % createdAt.getDate() === 1;
    const isTommorow = createdAt.getTime() % new Date().getDate() === 1;
    
    if (wasToday)
      return `Today at ${timestamp}`;
    if (wasYesterday)
      return `Yesterday at ${timestamp}`;
    else if (isTommorow)
      return `Tommorow at ${timestamp}`;

    return createdAt
      .toJSON()
      .slice(0,10)
      .split('-')
      .reverse()
      .join('/');
  }
  
  get timeString() {
    const date = new Date(this.message.createdAt);

    return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  get processed() {
    return toHTML(textEmoji(this.message.content));
  }

  get canManage() {
    // TODO: add channel and role permissions etc
    return this.message.author._id === this.usersService.user._id;
  }

  constructor(
    private log: LogService,
    private usersService: UsersService,
    private ws: WSService) {}

  removeEmbed() {
    this.log.info('SEND MESSAGE_UPDATE', 'msg');
    this.ws.socket.emit('MESSAGE_UPDATE', { message: this.message, withEmbed: false });
  }
}

interface MessageEmbed {
  title: string;
  description: string;
  image: string;
  url: string;
}
