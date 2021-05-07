import { Injectable } from '@angular/core';
import { Args } from 'src/app/types/ws-types';
import { ChannelService } from '../channel.service';
import { GuildService } from '../guild.service';
import { MessageService } from '../message.service';
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
    const guild = this.guildService.getGuildFromChannel(message.channelId);
    const ignored = this.pingService.isIgnored(message, guild?._id);
    if (!ignored)
      await this.pingService.add(message);

    this.messageService.overrideAdd([message]);
  }

  public deleteMessage({ channelId, messageId }: Args.MessageDelete) {
    const messages = this.messageService.getAllCached(channelId);
    const index = messages.findIndex(m => m._id === messageId);

    messages.splice(index, 1);
  }

  public updateMessage({ message }: Args.MessageUpdate) {
    const messages = this.messageService.getAllCached(message.channelId);
    let index = messages.findIndex(m => m._id === message._id);

    messages[index] = message;
  }

  public startTyping({ channelId, userId }: Args.TypingStart) {    
    this.channelService.startTyping(channelId, userId);
  }
}
