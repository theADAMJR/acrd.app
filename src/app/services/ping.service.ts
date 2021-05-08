import { Injectable } from '@angular/core';
import { Lean } from '../types/entity-types';
import { ChannelService } from './channel.service';
import { MessageService } from './message.service';
import { SoundService } from './sound.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private unread = new Map<string, string>();

  constructor(
    private sounds: SoundService,
    private channelService: ChannelService,
    private userService: UserService,
  ) {}

  public async init() {
    const lastRead = this.userService.self.lastReadMessages;    
    for (const channelId in lastRead) {
      const channel = this.channelService.getCached(channelId);
      const lastReadMessageId = lastRead[channelId];
      if (channel?.lastMessageId === lastReadMessageId) continue;

      await this.add({
        _id: lastReadMessageId,
        channelId,
      } as any, false);
    }
  }

  public markAsRead(channelId: string) {
    this.unread.delete(channelId);
  }
  public markGuildAsRead(guild: Lean.Guild) {
    for (const channel of guild.channels)
      this.markAsRead(channel._id);
  }

  public async add(message: Lean.Message, withSound = true) {
    this.unread.set(message.channelId, message._id);

    if (withSound) await this.sounds.ping();
  }

  public lastRead(channelId: string) {
    return this.unread.get(channelId);
  }

  public isGuildUnread(guild: Lean.Guild) {
    return guild.channels.some(c => this.unread.has(c._id));
  }

  public isUnread(channelId: string) {
    return this.unread.has(channelId);
  }

  public isIgnored(message: Lean.Message, guildId?: string): boolean {
    const user = this.userService.self;

    return message.authorId === user._id
      || user.ignored.channelIds.includes(message.channelId)
      || user.ignored.guildIds.includes(guildId)
      || user.ignored.userIds.includes(message.authorId);
  }
}
