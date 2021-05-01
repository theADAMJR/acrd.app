import { AfterContentInit, AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { LogService } from '../services/log.service';
import { PingService } from '../services/ping.service';
import { PermissionsService } from '../services/permissions.service';
import { SoundService } from '../services/sound.service';
import { UsersService } from '../services/users.service';
import { WSService } from '../services/ws.service';
import { MessageService } from '../services/message.service';
import { ChannelService } from '../services/channel.service';
import { Lean } from '../types/entity-types';

@Component({ template: '' })
export class TextBasedChannel implements OnInit {
  @Input() public channel: Lean.Channel;
  @Input() public guild: Lean.Guild;
  private messageBatchSize = 25;
  
  @ViewChild('message')
  private messageInput: ElementRef;
  
  public chatBox = new FormControl();
  public emojiPickerOpen = false;
  public ready = false;
  public messages = [];
  private lastTypedAt = null;

  public get typingUsernames() {
    return this.channelService
      .getTyping(this.channel._id)
      .map(async (id) => {
        const user = await this.userService.getAsync(id);
        return user.username;
      });
  }

  public get loadedAllMessages() {
    return this.messages.length <= 0
      || this.messages.length % this.messageBatchSize !== 0;
  }
  public get recipient() {
    return this.channelService.getRecipient(this.channel._id);
  }
  public get title() {
    return (this.channel.type === 'DM')
      ? `@me + @${this.recipient.username}`
      : `${this.guild.name} > #${this.channel.name}`;
  }

  constructor(
    protected route: ActivatedRoute,
    protected channelService: ChannelService,
    protected messageService: MessageService,
    public guildService: GuildService,
    protected log: LogService,
    protected router: Router,
    public perms: PermissionsService,
    public pings: PingService,
    public sounds: SoundService,
    public userService: UsersService,
    protected ws: WSService,
  ) {}

  public async ngOnInit() {    
    if (this.channel.type === 'VOICE')
      return this.router.navigate(['..']);

    document.title = this.title;
      
    this.pings.markAsRead(this.channel._id);
    this.messages = await this.messageService.getAllAsync(this.channel._id);

    this.ws.on('MESSAGE_CREATE', ({ message }) => {
      this.messages.push(message);
    }, this);
    
    this.ready = true;
    this.scrollToMessage();
  }

  private scrollToMessage(timeout = 100) {
    setTimeout(() => {
      const messages = document.querySelector('.messages');
      const height = messages.scrollHeight;
      messages.scrollTop = height;      
    }, timeout);
  }

  public async chat(content: string) {
    if (!content.trim()) return;
    
    content = content.replace(/\n+$/, '');
    this.messageInput.nativeElement.value = '';

    this.ws.emit('MESSAGE_CREATE', {
      channelId: this.channel._id,
      partialMessage: { content },
    }, this);
    await this.sounds.message();

    this.scrollToMessage(50);

    this.channelService.stopTyping(this.channel._id, this.userService.self._id);
  }

  public async loadMoreMessages() {
    if (this.loadedAllMessages) return;

    await this.messageService
      .overrideFetchAll(this.channel._id, {
        start: this.messages.length,
        end: this.messages.length + this.messageBatchSize
      });

    this.scrollToMessage();
  }
  
  public shouldCombine(index: number) {
    const lastIndex = Math.max(0, index - 1);
    const lastMessage = (index) ? this.messages[lastIndex] : null;
    if (!lastMessage) return false;

    const message = this.messages[index];
    const msDifference = new Date(message.createdAt).getTime() - new Date(lastMessage?.createdAt).getTime();    
    const minsAgo = msDifference / 60 / 1000;    

    const maxTimeDifference = 5;
    return message.authorId === lastMessage?.authorId && minsAgo < maxTimeDifference;
  }

  public async emitTyping() { 
    const sinceLastTyped = new Date().getTime() - this.lastTypedAt?.getTime();    
    if (sinceLastTyped < 5 * 1000) return;
    
    await this.ws.emitAsync('TYPING_START', {
      channelId: this.channel._id,
    }, this);

    this.lastTypedAt = new Date();
  }

  // emoji picker
  public addEmoji({ emoji }) {
    this.messageInput.nativeElement.value += emoji.native;
  }

  public onClick({ path }) {
    const emojiPickerWasClicked = path
      .some(n => n && n.nodeName === 'EMOJI-MART'
        || n.classList?.contains('emoji-icon'));
    this.emojiPickerOpen = emojiPickerWasClicked;
  }
}
