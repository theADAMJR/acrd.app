import { Injectable } from '@angular/core';
import { Lean } from '../types/entity-types';
import { SoundService } from './sound.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private unread = new Map<string, string>();

  constructor(
    private sounds: SoundService,
    private userService: UserService,
  ) {}

  public markAsRead(channelId: string) {
    this.unread.delete(channelId);
  }

  public async add(channelId: string, lastMessageId: string) {
    this.unread.set(channelId, lastMessageId);

    await this.sounds.ping();
  }

  public lastRead(channelId: string) {
    return this.unread.get(channelId);
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
