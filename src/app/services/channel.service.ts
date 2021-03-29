import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChannelTypes, Lean } from '../types/entity-types';
import { GuildService } from './guild.service';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class ChannelService {
  readonly endpoint = environment.endpoint + '/channels';
  
  private get headers() {
    return {
      headers: { Authorization: `Bearer ${localStorage.getItem('key')}` }
    }
  };

  cachedMessages = new Map<string, Lean.Message[]>();
  _dmChannels: ChannelTypes.DM[] = [];

  public get dmChannels() {
    return this._dmChannels;
  }
  private get key() {
    return localStorage.getItem('key');
  }

  constructor(
    private guildService: GuildService,
    private http: HttpClient,
    private userService: UsersService) {}

  public async init() {
    if (this.dmChannels.length <= 0)
      await this.updateDMChannels();
  }

  public getChannel(guildId: string, channelId: string): Lean.Channel {
    const guild = this.guildService.getGuild(guildId);
    return guild?.channels.find(c => c._id === channelId);
  }

  public getDMChannel(recipientId: string): ChannelTypes.DM {
    return this.dmChannels.find(c => c.memberIds.includes(recipientId)
      && c.memberIds.includes(this.userService.user._id));
  }
  public getDMChannelById(id: string) {
    return this.dmChannels.find(c => c._id === id);
  }
  public async updateDMChannels(): Promise<void> {
    this._dmChannels = (this.key)
      ? await this.http.get(
        `${environment.endpoint}/users/dm-channels`,
        this.headers).toPromise() as any
      : [];
  }

  public async getMessages(channelId: string, options?: LazyLoadOptions): Promise<Lean.Message[]> {
    return this.cachedMessages.get(channelId)
      ?? this.cachedMessages
        .set(channelId, await this.fetchMessages(channelId, options))
        .get(channelId);
  }

  private async fetchMessages(channelId: string, options?: LazyLoadOptions) {
    const query = `?start=${options?.start ?? 0}&end=${options?.end ?? 25}`;
    return this.http
      .get(`${this.endpoint}/${channelId}/messages${query}`,this.headers)
      .toPromise() as any;
  }
}

interface LazyLoadOptions { start: number, end: number }
