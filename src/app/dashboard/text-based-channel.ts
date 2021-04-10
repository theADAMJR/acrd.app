import { Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ChannelService } from '../services/channel.service';
import { GuildService } from '../services/guild.service';
import { LogService } from '../services/log.service';
import { NotificationService } from '../services/notification.service';
import { PermissionsService } from '../services/permissions.service';
import { SoundService } from '../services/sound.service';
import { UsersService } from '../services/users.service';
import { Args, WSService } from '../services/ws.service';
import { Lean } from '../types/entity-types';

@Component({ template: '' })
export class TextBasedChannel {
  @ViewChild('message')
  private messageInput: ElementRef;

  public activeChannelId: string;
  public channel: Lean.Channel;
  public chatBox = new FormControl();
  public emojiPickerOpen = false;
  public messages = [];
  public parentId: string;
  public typingUserIds = [];

  private lastTypingEmissionAt = null;

  public get typingUsernames() {
    return this.typingUserIds
      .map(id => this.userService
        .getKnown(id).username);
  }
  public get loadedAllMessages() {
    return this.messages.length <= 0
      || this.messages.length % 25 !== 0;
  }
  public get recipient() {
    const recipientId = this.channel.memberIds
      ?.find(id => id !== this.userService.user._id);
    return this.userService.getKnown(recipientId);
  }

  constructor(
    private channelService: ChannelService,
    public guildService: GuildService,
    private log: LogService,
    private route: ActivatedRoute,
    public userService: UsersService,
    public perms: PermissionsService,
    public sounds: SoundService,
    private ws: WSService,
    public notifications: NotificationService,
  ) {}

  public async init() {
    this.route.paramMap.subscribe(async(paramMap) => {
      this.parentId = paramMap.get('guildId') ?? '@me';

      const channelId = this.activeChannelId = this.route.snapshot.paramMap.get('channelId');
      this.channel = this.channelService.getDMChannelById(channelId)
        ?? this.channelService.getChannel(this.parentId, channelId);

      this.notifications.markAsRead(channelId);

      document.title = (this.parentId === '@me')
        ? `@${this.recipient.username}`
        : `#${this.channel.name}`;

      this.messages = await this.channelService.getMessages(channelId);
      
      setTimeout(() => this.scrollToMessage(), 100);
      
      this.hookWSEvents();
    });
  }

  public hookWSEvents() {
    this.ws
      .once('MESSAGE_CREATE', this.createMessage, this)
      .once('MESSAGE_UPDATE', this.updateMessage, this)
      .once('MESSAGE_DELETE', this.deleteMessage, this)
      .once('TYPING_START', this.addTypingUser, this);
  }

  private addTypingUser({ userId }: Args.TypingStart) {
    const selfIsTyping = this.typingUserIds.includes(this.userService.user._id);
    if (!selfIsTyping)
      this.typingUserIds.push(userId);

    setTimeout(() => this.stopTyping(userId), 5.1 * 1000);
  }

  private async createMessage({ message }: Args.MessageCreate) { 
    const selfIsAuthor = message.authorId === this.userService.user._id; 
    if (selfIsAuthor)
      await this.sounds.message();

    const channelIsActive = this.activeChannelId === this.channel._id;
    (channelIsActive)
      ? this.messages.push(message)
      : this.channelService.addMessage(message);

    setTimeout(() => this.scrollToMessage(), 100);
  }

  private updateMessage({ messageId, partialMessage }: Args.MessageUpdate) {
    let index = this.messages.findIndex(m => m._id === messageId);
    this.messages[index] = {
      ...this.messages[index],
      ...partialMessage,
    };
  }

  private deleteMessage({ messageId }: Args.MessageDelete) {
    let index = this.messages.findIndex(m => m._id === messageId);
    this.messages.splice(index, 1);
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
    
    this.messageInput.nativeElement.value = '';

    this.ws.emit('MESSAGE_CREATE', {
      channelId: this.channel._id,
      partialMessage: { content },
    });

    this.stopTyping(this.userService.user._id);
  }

  public async loadMoreMessages() {
    if (this.loadedAllMessages) return;

    this.log.info('Loading more messages', 'text');

    const moreMessages = await this.channelService
      .getMessages(this.channel._id, {
        start: this.messages.length,
        end: this.messages.length + 25
      });
    
    this.scrollToMessage(this.messages.length);

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
    });

    this.lastTypingEmissionAt = new Date();
  }

  private stopTyping(userId: string) {
    const index = this.typingUserIds.indexOf(userId);
    this.typingUserIds.splice(index, 1);
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
