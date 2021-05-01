import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { LogService } from '../services/log.service';
import { PingService } from '../services/ping.service';
import { PermissionsService } from '../services/permissions.service';
import { SoundService } from '../services/sound.service';
import { UsersService } from '../services/users.service';
import { Args, WSService } from '../services/ws.service';
import { MessageService } from '../services/message.service';
import { ChannelService } from '../services/channel.service';

@Component({ template: '' })
export class TextBasedChannel {
  private get channelId() {
    return this.channelService.self?._id
      ?? this.route.snapshot.paramMap.get('channelId');
  }

  public get channel() {
    return this.channelService.self
      ?? this.channelService.getCached(this.channelId);
  }
  public get guild() {
    return this.guildService.self;
  }
  public get typingUserIds(): string[] {
    return this.channelService.getTyping(this.channelId);
  }
  
  @ViewChild('message')
  private messageInput: ElementRef;
  
  public chatBox = new FormControl();
  public emojiPickerOpen = false;
  public messages = [];
  public ready = false;

  private lastTypingEmissionAt = null;

  public get typingUsernames() {
    return this.typingUserIds
      .map(async (id) => {
        const user = await this.userService.getAsync(id);
        return user.username;
      });
  }
  public get loadedAllMessages() {
    return this.messages.length <= 0
      || this.messages.length % 25 !== 0;
  }
  public get recipient() {
    const recipientId = this.channel.memberIds
      ?.find(id => id !== this.userService.self._id);
    return this.userService.getCached(recipientId);
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

  public async init() {
    if (this.channel.type === 'VOICE')
      return this.router.navigate(['..']);

    this.pings.markAsRead(this.channel._id);

    document.title = this.title;
    this.messages = await this.messageService.overrideFetchAll(this.channel._id);
    
    setTimeout(() => this.scrollToMessage(), 100);
    
    this.ready = true;
  }

  private scrollToMessage(end?: number) {
    const messages = document.querySelector('.messages');

    let combinedHeight = 0;    
    Array.from(document.querySelectorAll(`.message`))
      .slice(0, end ?? this.messages.length)
      .forEach(e => combinedHeight += e.scrollHeight);

    messages.scrollTop = (end)
      ? messages.scrollHeight - combinedHeight
      : combinedHeight;
  }

  public async chat(content: string) {
    if (!content.trim()) return;
    
    content = content.replace(/\n+$/, '');
    this.messageInput.nativeElement.value = '';

    this.ws.silentEmitAsync('MESSAGE_CREATE', {
      channelId: this.channel._id,
      partialMessage: { content },
    }, this);
    await this.sounds.message();

    this.scrollToMessage(this.messages.length);
    this.channelService.stopTyping(this.channelId, this.userService.self._id);
  }

  public async loadMoreMessages() {
    if (this.loadedAllMessages) return;

    this.log.info('Loading more messages', 'text');

    const moreMessages = await this.messageService
      .overrideFetchAll(this.channel._id, {
        start: this.messages.length,
        end: this.messages.length + 25
      });
    

    this.messages = moreMessages
      .concat(this.messages)
      .sort((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? 1 : -1);
  }
  
  public shouldCombine(index: number) {
    const lastIndex = Math.max(0, index - 1);
    const lastMessage = (index) ? this.messages[lastIndex] : null;
    if (!lastMessage)
      return false;

    const message = this.messages[index];
    
    const msDifference = new Date(message.createdAt).getTime() - new Date(lastMessage?.createdAt).getTime();    
    const minsAgo = msDifference / 60 / 1000;    

    return (message.authorId === lastMessage?.authorId)
      && minsAgo < 5;
  }

  public emitTypingStart() { 
    const sinceLastTyped = new Date().getTime() - this.lastTypingEmissionAt?.getTime();    
    if (sinceLastTyped < 5 * 1000) return;
    
    this.ws.emit('TYPING_START', {
      channelId: this.channel._id,
    }, this);

    this.lastTypingEmissionAt = new Date();
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
