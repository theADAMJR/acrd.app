import { Component, Input } from '@angular/core';
import { toHTML } from 'discord-markdown';
import { textEmoji } from 'markdown-to-text-emoji';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
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

  @Input() guild: any;
  @Input() member: any;

  embed: MessageEmbed;

  get author() {
    return this.usersService.getKnown(this.message.authorId);
  }
  
  get roleColor() {
    if (!this.guild) return;

    const roleId = this.member?.roleIds[this.member?.roleIds.length - 1];
    return this.guild.roles.find(r => r._id == roleId)?.color;
  }

  get timestamp() { 
    const createdAt = new Date(this.message.createdAt ?? new Date());
    const timestamp = createdAt
      .toTimeString()
      .slice(0, 5);
    
    if (this.getDaysAgo(createdAt))
      return `Today at ${timestamp}`;
    if (this.getDaysAgo(createdAt, 1))
      return `Yesterday at ${timestamp}`;
    else if (this.getDaysAgo(createdAt, -1))
      return `Tomorrow at ${timestamp}`;

    return createdAt
      .toJSON()
      .slice(0,10)
      .split('-')
      .reverse()
      .join('/');
  }
  private getDaysAgo(date: Date, days = 0) {
    return date.getDate() === new Date().getDate() + days
      && date.getMonth() === new Date().getMonth()
      && date.getFullYear() === new Date().getFullYear()
  }
  
  get timeString() {
    const date = new Date(this.message.createdAt);
    return `${date.toString().slice(16, 21)}`;
  }

  get isMentioned() {
    return document.querySelector(`#message-${this.message._id} .self-mention`);
  }

  get processed() {
    const getRole = (id: string) => this.guild?.roles.find(r => r._id === id);
    const getUser = (id: string) => this.guild?.members.find(m => m.user._id === id)?.user;

    const getMention = (html: string, condition: boolean) => {
      return (condition)
        ? `<span class="self-mention">${html}</span>`
        : html;
    };

    const recipientHasRole = this.guildService
      .getMember(this.guild?._id, this.usersService.user._id)?.roleIds
      .some(id => this.guild?.roles.some(r => r._id === id));
  
    return toHTML(textEmoji(this.message.content), {
      discordCallback: {
        user: (node) => getMention(
          `@${getUser(node.id)?.username ?? `Invalid User`}`,
          this.usersService.user._id === node.id),

        role: (node) => getMention(
          `@${getRole(node.id)?.name ?? `Invalid Role`}`,
          recipientHasRole),

        everyone: (node) => getMention(`@everyone`, true),
        here: (node) => getMention(`@here`, this.usersService.user.status !== 'OFFLINE')
      }
    });
  }

  get canManage() {
    return this.message.author?._id === this.usersService.user._id
      || (this.guild && this.perms.can(this.guild._id, 'MANAGE_MESSAGES'));
  }

  constructor(
    private log: LogService,
    private guildService: GuildService,
    private usersService: UsersService,
    private ws: WSService,
    private perms: PermissionsService
  ) {}

  removeEmbed() {
    this.message.embed = null;

    this.log.info('SEND MESSAGE_UPDATE', 'msg');
    this.ws.socket.emit('MESSAGE_UPDATE', { message: this.message, withEmbed: false });
  }

  delete() {
    this.log.info('SEND MESSAGE_DELETE', 'msg');
    this.ws.socket.emit('MESSAGE_DELETE', this.message);

    document
      .querySelector(`#message${this.message._id}`)
      ?.remove();
  }
}

interface MessageEmbed {
  title: string;
  description: string;
  image: string;
  url: string;
}
