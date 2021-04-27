import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Lean } from 'src/app/types/entity-types';
import { ChannelService } from '../channel.service';
import { GuildService } from '../guild.service';
import { SoundService } from '../sound.service';
import { UsersService } from '../users.service';
import { Args, WSService } from '../ws.service';

@Injectable({
  providedIn: 'root'
})
export class MyEventService {
  constructor(
    private channelService: ChannelService,
    private guildService: GuildService,
    private router: Router,
    private sounds: SoundService,
    private usersService: UsersService,
  ) {}

  public async addFriend({ sender, friend, dmChannel }: Args.AddFriend) {
    this.updateFriends({ sender, friend });
    if (dmChannel)
      this.channelService.dmChannels.push(dmChannel);
  }
  public updateFriends({ sender, friend }: { sender: Lean.User, friend: Lean.User }) {
    this.usersService.upsertCached(sender._id, sender);
    this.usersService.upsertCached(friend._id, friend);
  }

  public async joinGuild({ guild }: Args.GuildJoin) {
    this.guildService.guilds.push(guild);
    await this.router.navigate([`/channels/${guild._id}`]);

    await this.sounds.success();
  }

  public updatePresence(args: Args.PresenceUpdate) {
    this.usersService.upsertCached(args.userId, { status: args.status });
  }
}
