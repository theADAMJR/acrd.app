import { Injectable } from '@angular/core';
import { Lean } from '../types/entity-types';
import { ChannelService } from './api/channel.service';
import { SoundService } from './sound.service';
import { UserService } from './api/user.service';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private unread = new Map<string, string>();

  constructor(
    private channelService: ChannelService,
    private sounds: SoundService,
    private userService: UserService,
  ) {}

  public async init() {
    const lastRead = this.userService.self.lastReadMessages;    

    for (const channelId in lastRead) {
      const lastReadMessageId = lastRead[channelId];
      const channel = this.channelService.getCached(channelId);
      if (!lastReadMessageId
          || this.isChannelIgnored(channelId)
          || !lastReadMessageId
          || channel?.lastMessageId === lastReadMessageId) continue;
      
      await this.add({
        id: lastReadMessageId,
        channelId,
      } as any, false);
    }
  }

  public markAsRead(channelId: string) {
    this.unread.delete(channelId);
  }
  public async markGuildAsRead(guild: Lean.Guild) {
    for (const channel of guild.channels)
      this.markAsRead(channel.id);
  }

  public async add(message: Lean.Message, withSound = true) {
    this.unread.set(message.channelId, message.id);

    if (withSound) await this.sounds.ping();
  }

  public lastRead(channelId: string) {
    return this.unread.get(channelId);
  }

  public isGuildUnread(guild: Lean.Guild) {
    return guild.channels.some(c => this.unread.has(c.id));
  }

  public isUnread(channelId: string) {
    return this.unread.has(channelId);
  }

  public isIgnored(message: Lean.Message, guildId?: string): boolean {
    const user = this.userService.self;

    return message.authorId === user.id
      || this.isChannelIgnored(message.channelId)
      || user.ignored.userIds.includes(message.authorId);
  }
  private isChannelIgnored(channelId: string) {
    const channel = this.channelService.getCached(channelId);
    const user = this.userService.self;

    return user.ignored.channelIds.includes(channelId)
      || user.ignored.guildIds.includes(channel?.guildId);
  }
}
