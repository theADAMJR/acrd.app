import { Injectable } from '@angular/core';
import { SoundService } from './sound.service';

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private unread = new Map<string, string>();

  constructor(private sounds: SoundService) {}

  public markAsRead(channelId: string) {
    this.unread.delete(channelId);
  }

  public async add(channelId: string, lastMessageId: string) {
    this.unread.set(channelId, lastMessageId);

    await this.sounds.notification();
  }

  public lastRead(channelId: string) {
    return this.unread.get(channelId);
  }

  public isUnread(channelId: string) {
    return this.unread.has(channelId);
  }
}
