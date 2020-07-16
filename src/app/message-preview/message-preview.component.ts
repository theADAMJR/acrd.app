import { Component, Input } from '@angular/core';
import { toHTML } from 'discord-markdown';
import { textEmoji } from 'markdown-to-text-emoji';
import { UserService } from '../services/user.service';

@Component({
  selector: 'message-preview',
  templateUrl: './message-preview.component.html',
  styleUrls: ['./message-preview.component.css']
})
export class MessagePreviewComponent {
  @Input() guild = { name: 'Testing123', memberCount: 420 };
  @Input() eventVariables = true;

  @Input() content = 'Hello World';
  @Input() author = {
    username: '2PG',
    avatarURL: 'https://cdn.discordapp.com/avatars/685867703352819720/0a0f52a53a02c58382d2cc88985451fb.png?size=256'
  }
  @Input() member = {
    displayName: '2PG'
  }
  @Input() createdAt = new Date();

  constructor(private userService: UserService) {}

  get timestamp() {
    const timestamp = this.createdAt.toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric'
    });

    const wasToday = new Date().getDay() / this.createdAt.getDay() === 1;
    const wasYesterday = new Date().getDate() % this.createdAt.getDate() === 1;
    const isTommorow = this.createdAt.getTime() % new Date().getDate() === 1;
    
    if (wasToday || wasYesterday)
      return `Today at ${timestamp}`;
    if (wasYesterday)
      return `Yesterday at ${timestamp}`;
    else if (isTommorow)
      return `Tommorow at ${timestamp}`;

    return this.createdAt
      .toJSON()
      .slice(0,10)
      .split('-')
      .reverse()
      .join('/');
  }

  get processed() {
    const user = this.userService.user;

    return (this.eventVariables) ? toHTML(textEmoji(this.content
      .replace(/\[GUILD\]/, this.guild?.name)
      .replace(/\[INSTIGATOR\]/, '@3PG#8166')
      .replace(/\[MEMBER_COUNT\]/g, this.guild?.memberCount.toString())
      .replace(/\[MESSAGE\]/g, 'Testing123')
      .replace(/\[MODULE\]/g, 'General')
      .replace(/\[NEW_LEVEL\]/g, '2')
      .replace(/\[NEW_VALUE\]/g, JSON.stringify({ prefix: '.' }, null, 2))
      .replace(/\[OLD_LEVEL\]/g, '1')
      .replace(/\[OLD_VALUE\]/g, JSON.stringify({ prefix: '/' }, null, 2))
      .replace(/\[REASON\]/g, 'not having 3PG PRO')
      .replace(/\[USER\]/g, `@${user.tag}`)))
      .replace(/\[XP\]/g, '300') : toHTML(textEmoji(this.content));
  }
}
