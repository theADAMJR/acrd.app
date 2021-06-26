import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UserTypes } from 'src/app/types/entity-types';
import { ChannelService } from '../api/channel.service';
import { GuildService } from '../api/guild.service';
import { PingService } from '../ping.service';
import { UserService } from '../api/user.service';
import { Args } from '../ws.service';

@Injectable({
  providedIn: 'root'
})
export class MyEventService {
  constructor(
    private channelService: ChannelService,
    private guildService: GuildService,
    private pings: PingService,
    private router: Router,
    private userService: UserService,
  ) {}

  public updateFriends({ sender, friend }: Args.RemoveFriend) {
    this.userService.upsert(sender.id, sender);    
    this.userService.upsert(friend.id, friend);
  }

  public async joinGuild({ guild }: Args.GuildJoin) {
    await this.userService.fetchAll();
    this.guildService.upsert(guild.id, guild);

    for (const channel of guild.channels)
      this.channelService.add(channel);

    await this.router.navigate([`/channels/${guild.id}`]);
  }

  public updatePresence({ userId, status }: Args.PresenceUpdate) {
    this.userService.upsert(userId, { status });
  }

  public async updateUser({ partialUser }: Args.UserUpdate) {
    const user = this.userService.self;
    this.userService.upsert(user.id, partialUser);

    if ('lastReadMessages' in partialUser)
      await this.updateReadMessages(partialUser);
  }

  private async updateReadMessages(partialUser: Partial<UserTypes.Self>) {
    for (const channelId in partialUser.lastReadMessages) {
      const channel = await this.channelService.getAsync(channelId);
      const messageId = partialUser.lastReadMessages[channelId];

      if (channel?.lastMessageId === messageId)
        this.pings.markAsRead(channelId);
    }
  }
}
