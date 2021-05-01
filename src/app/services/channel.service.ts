import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ChannelTypes, Lean } from '../types/entity-types';
import { GuildService } from './guild.service';
import { HTTPWrapper } from './http-wrapper';
import { UsersService } from './users.service';
import { WSService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class ChannelService extends HTTPWrapper<Lean.Channel> {
  protected endpoint = `${environment.endpoint}/channels`;
  public typingUserIds = new Map<string, string[]>();
  
  protected _arr: Lean.Channel[] = [];
  public get channels(): Lean.Channel[] {
    return this._arr = this.guildService.guilds
      .flatMap(c => c.channels)
      .concat(this._arr);
  }
  public get dmChannels(): ChannelTypes.DM[] {
    return this.channels.filter(c => c.type === 'DM') as ChannelTypes.DM[];
  }

  constructor(
    http: HttpClient,
    ws: WSService,
    private guildService: GuildService,
    private userService: UsersService,
  ) { super(http, ws); }

  public getDM(recipientId: string): ChannelTypes.DM {
    return this.dmChannels.find(c =>c.memberIds.includes(recipientId)
      && c.memberIds.includes(this.userService.self._id));
  }

  public startTyping(channelId: string, userId: string) {
    const channelUsers = this.getTyping(channelId);
    const selfIsTyping = channelUsers.includes(this.self._id);
    if (!selfIsTyping)
      channelUsers.push(userId);

    setTimeout(() => this.stopTyping(channelId, userId), 5.1 * 1000);
  }
  public stopTyping(channelId: string, userId: string) {
    const channelUsers = this.getTyping(channelId);
    const index = channelUsers.indexOf(userId);

    channelUsers.splice(index, 1);
  }
  public getTyping(channelId: string) {
    return this.typingUserIds.get(channelId)
      ?? this.typingUserIds
        .set(channelId, [])
        .get(channelId);
  }

  public getRecipient(channelId: string) {
    const channel = this.getCached(channelId);
    const recipientId = channel.memberIds
      .find(id => id !== this.userService.self._id);
    return this.userService.getCached(recipientId);
  }
}
