import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ChannelTypes, Lean } from '../types/entity-types';
import { GuildService } from './guild.service';
import { HTTPWrapper } from './http-wrapper';
import { UsersService } from './users.service';
import { WSService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class ChannelService extends HTTPWrapper {
  private readonly endpoint = environment.endpoint + '/channels';
  private _dmChannels: ChannelTypes.DM[] = [];

  public get dmChannels() {
    return this._dmChannels;
  }

  constructor(
    http: HttpClient,
    ws: WSService,
    private guildService: GuildService,
    private userService: UsersService,
  ) { super(http, ws); }

  public async init() {
    if (this.dmChannels.length <= 0)
      await this.updateDMChannels();
  }

  public get(guildId: string, channelId: string): Lean.Channel {
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
}
