import { Injectable } from '@angular/core';
import { Args } from 'src/app/types/ws-types';
import { ChannelService } from '../api/channel.service';
import { GuildService } from '../api/guild.service';
import { MessageService } from '../api/message.service';
import { PingService } from '../ping.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelEventService {
  constructor(
    private channelService: ChannelService,
    private guildService: GuildService,
    private messageService: MessageService,
    private pingService: PingService,
  ) {}

  public async addMessage({ message }: Args.MessageCreate) { 
    const channel = this.channelService.getCached(message.channelId);
    const guild = this.guildService.getCached(channel.guildId);
    const ignored = this.pingService.isIgnored(message, guild?.id);
    if (!ignored)
      await this.pingService.add(message);

    this.messageService.overrideAdd([message]);
    channel.lastMessageId = message.id;
  }

  public deleteMessage({ channelId, messageId }: Args.MessageDelete) {
    const messages = this.messageService.getAllCached(channelId);
    const index = messages.findIndex(m => m.id === messageId);

    messages.splice(index, 1);
  }

  public updateMessage({ message }: Args.MessageUpdate) {
    const messages = this.messageService.getAllCached(message.channelId);
    let index = messages.findIndex(m => m.id === message.id);

    Object.assign(messages[index], message);
  }

  public startTyping({ channelId, userId }: Args.TypingStart) {    
    this.channelService.startTyping(channelId, userId);
  }
}
