import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GuildService } from './guild.service';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  readonly endpoint = environment.endpoint + '/channels';

  cachedMessages = new Map<string, Map<string, any[]>>();
  dmChannels = [];

  private get key() {
    return localStorage.getItem('key');
  }

  constructor(
    private guildService: GuildService,
    private http: HttpClient,
    private userService: UsersService) {}

  async init() {
    if (this.dmChannels.length <= 0)
      await this.updateDMChannels();
  }

  getChannel(guildId: string, channelId: string) {
    const guild = this.guildService.getGuild(guildId);
    return guild?.channels.find(c => c._id === channelId);
  }

  getDMChannel(recipientId: string) {
    return this.dmChannels.find(c => c.recipientIds.includes(recipientId)
      && c.recipientIds.includes(this.userService.user._id));
  }
  getDMChannelById(id: string) {
    return this.dmChannels.find(c => c._id === id);
  }
  async updateDMChannels() {
    this.dmChannels = (this.key) ?
      await this.http.get(`${environment.endpoint}/users/dm-channels`,
        { headers: { Authorization: this.key } }).toPromise() as any : [];
  }

  async getMessages(guildId: string, channelId: string, options?: LazyLoadOptions): Promise<any> {
    const messageMap = this.getMessageMap(guildId);
    
    let messages = messageMap.get(channelId);
    if (!messages) {
      messages = await this.http
        .get(`${environment.endpoint}/channels/${guildId}/${channelId}?start=${options?.start ?? 0}&end=${options?.end ?? 25}`,
          { headers: { Authorization: this.key } }).toPromise() as any;
      messageMap.set(channelId, messages);
    }
    
    return messages;
  }

  getMessageMap(guildId: string) {
    return this.cachedMessages.get(guildId)
      ?? this.cachedMessages
        .set(guildId, new Map())
        .get(guildId);
  }
}

interface LazyLoadOptions { start: number, end: number }