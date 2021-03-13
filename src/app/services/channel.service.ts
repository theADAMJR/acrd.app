import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean } from '../types/entity-types';
import { GuildService } from './guild.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  readonly endpoint = environment.endpoint + '/channels';
  private readonly headers = { headers: { Authorization: this.key } };

  cachedMessages = new Map<string, Map<string, Lean.Message[]>>();
  _dmChannels: Lean.Channel[] = [];

  get dmChannels() {
    return this._dmChannels;
  }
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

  getChannel(guildId: string, channelId: string): Lean.Channel {
    const guild = this.guildService.getGuild(guildId);
    return guild?.channels.find(c => c._id === channelId);
  }

  getDMChannel(recipientId: string): Lean.Channel {
    return this.dmChannels.find(c => c.recipientIds.includes(recipientId)
      && c.recipientIds.includes(this.userService.user._id));
  }
  getDMChannelById(id: string): Lean.Channel {
    return this.dmChannels.find(c => c._id === id);
  }
  async updateDMChannels(): Promise<any> {
    this._dmChannels = (this.key)
      ? await this.http.get(
        `${environment.endpoint}/users/dm-channels`,
        this.headers).toPromise() as any
      : [];
  }

  async getMessages(guildId: string, channelId: string, options?: LazyLoadOptions): Promise<Lean.Message[]> {
    const messageMap = this.getMessageMap(guildId);
    
    let messages = messageMap.get(channelId);
    if (!messages) {
      const query = `?start=${options?.start ?? 0}&end=${options?.end ?? 25}`;
      messages = await this.http
        .get(`${this.endpoint}/${guildId}/${channelId}${query}`,
          { headers: { Authorization: this.key } }).toPromise() as any;
      messageMap.set(channelId, messages);
    }    
    return messages;
  }
  public getMessageMap(guildId: string) {
    return this.cachedMessages.get(guildId)
      ?? this.cachedMessages
        .set(guildId, new Map())
        .get(guildId);
  }
}

interface LazyLoadOptions { start: number, end: number }