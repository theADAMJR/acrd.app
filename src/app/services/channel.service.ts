import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GuildService } from './guild.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  readonly endpoint = environment.endpoint + '/channels';
  messages = [];

  private get key() {
    return localStorage.getItem('key');
  }

  constructor(
    private guildService: GuildService,
    private http: HttpClient) {}

  getChannel(guildId: string, channelId: string) {
    const guild = this.guildService.getGuild(guildId);
    return guild?.channels.find(c => c._id === channelId);
  }

  getMessages(guildId: string, channelId: string, options?: LazyLoadOptions): Promise<any> {
    return this.http
      .get(`${environment.endpoint}/channels/${guildId}/${channelId}?start=${options?.start ?? 0}&end=${options?.end ?? 25}`,
        { headers: { Authorization: this.key } }).toPromise();
  }
}

interface LazyLoadOptions { start: number, end: number }