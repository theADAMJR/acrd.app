import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuTrigger } from '@angular/material/menu';
import { toHTML } from 'discord-markdown';
import { textEmoji } from 'markdown-to-text-emoji';
import { ProfileComponent } from 'src/app/dialog/profile/profile.component';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/services/dialog.service';
import { GuildService } from 'src/app/services/api/guild.service';
import { LogService } from 'src/app/services/log.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UserService } from 'src/app/services/api/user.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() public message: Lean.Message;
  @Input() public isExtra = false;
  @Input() public guild: Lean.Guild;
  @Input() public member: Lean.GuildMember;
  @Input() public avatarURL: string;

  @ViewChild('newMessage')
  public newMessage: ElementRef;
  @ViewChild('contextMenu')
  public contextMenu: MatMenu;

  public embed: MessageEmbed;
  public contextMenuPosition = { x: '0px', y: '0px' };
  public author: Lean.User;

  private _isEditing = false;
  public get isEditing() {
    return this._isEditing;
  }
  public set isEditing(value: boolean) {
    this._isEditing = value;
    const div: HTMLDivElement = this.newMessage.nativeElement;
    if (value) div.focus();
  }
  
  public get roleColor(): string {
    if (!this.guild) return;

    const roleId = this.member?.roleIds[this.member?.roleIds.length - 1];
    return this.guild.roles.find(r => r._id == roleId)?.color;
  }
  
  public get timeString() {
    const date = new Date(this.message.createdAt);
    return `${date.toString().slice(16, 21)}`;
  }

  public get isMentioned() {
    return document.querySelector(`#message-${this.message._id} .self-mention`);
  }

  public get updatedAt() {
    return new Date(this.message.updatedAt)?.toLocaleString();
  }

  public get processed() {
    if (this.isEditing) return this.message.content;

    const getRole = (id: string) => this.guild?.roles.find(r => r._id === id);
    const getUser = (id: string) => this.userService.getCached(id);

    const getMention = (html: string, condition: boolean) => {
      return (condition)
        ? `<span matTooltip="test" class="self-mention">${html}</span>`
        : html;
    };

    const recipientHasRole = this.guildService
      .getMember(this.guild?._id, this.userService.self._id)?.roleIds
      .some(id => this.guild?.roles.some(r => r._id === id));
  
    return toHTML(textEmoji(this.message.content), {
      discordCallback: {
        user: async (node) => getMention(
          `@${(await getUser(node.id))?.username ?? `Invalid User`}`,
          this.userService.self._id === node.id),

        role: (node) => getMention(
          `@${getRole(node.id)?.name ?? `Invalid Role`}`,
          recipientHasRole),

        everyone: (node) => getMention(`@everyone`, true),
        here: (node) => getMention(`@here`, this.userService.self.status !== 'OFFLINE')
      }
    });
  }

  public get selfIsAuthor() {
    return this.author?._id === this.userService.self._id;
  }

  public get canManage() {
    return this.selfIsAuthor
      || (this.guild && this.perms.can(this.guild._id, 'MANAGE_MESSAGES'));
  }

  constructor(
    public config: ConfigService,
    private log: LogService,
    private guildService: GuildService,
    public userService: UserService,
    private ws: WSService,
    private perms: PermissionsService,
    public dialog: DialogService,
  ) {}

  public async ngOnInit() {
    this.author = await this.userService.getCached(this.message.authorId);
  }

  public removeEmbed() {
    this.message.embed = null;
    
    this.ws.emit('MESSAGE_UPDATE', {
      messageId: this.message._id,
      partialMessage: this.message,
      withEmbed: false
    }, this);
  }

  public delete() {
    this.ws.emit('MESSAGE_DELETE', { messageId: this.message._id }, this);

    document
      .querySelector(`#message${this.message._id}`)
      ?.remove();

    this.ws.on('MESSAGE_DELETE', async ({ messageId }) => {
      if (messageId === this.message._id)
        await this.log.success();
    }, this);
  }

  public async edit(value: string, $event?: KeyboardEvent) {
    if ($event && ($event.shiftKey || $event.code !== 'Enter')) return;

    this.isEditing = false;
    this.message.content = value;
    this.message.updatedAt = new Date();

    this.ws.emit('MESSAGE_UPDATE', {
      messageId: this.message._id,
      partialMessage: { content: this.message.content },
      withEmbed: Boolean(this.message.embed),
    }, this);

    this.ws.on('MESSAGE_UPDATE', async ({ message }) => {
      if (message.content === this.message.content)
        await this.log.success();
    }, this);
  }

  public async toggleEditing($event?: KeyboardEvent) {
    (this.isEditing)
      ? await this.edit(this.newMessage.nativeElement.innerText, $event)
      : this.isEditing = true;
  }

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    menuTrigger.menu.focusFirstItem('mouse');
    menuTrigger.openMenu();
  }
}

interface MessageEmbed {
  title: string;
  description: string;
  image: string;
  url: string;
}
