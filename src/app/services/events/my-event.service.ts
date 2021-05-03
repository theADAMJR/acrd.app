import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Lean } from 'src/app/types/entity-types';
import { ChannelService } from '../channel.service';
import { GuildService } from '../guild.service';
import { SoundService } from '../sound.service';
import { UserService } from '../user.service';
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
    private userService: UserService,
  ) {}

  public async addFriend({ sender, friend, dmChannel }: Args.AddFriend) {
    this.updateFriends({ sender, friend });
    if (dmChannel)
      this.channelService.dmChannels.push(dmChannel);
  }
  public updateFriends({ sender, friend }: { sender: Lean.User, friend: Lean.User }) {
    this.userService.upsert(sender._id, sender);
    this.userService.upsert(friend._id, friend);
  }

  public async joinGuild({ guild }: Args.GuildJoin) {
    await this.userService.fetchAll();
    this.guildService.add(guild);

    await this.router.navigate([`/channels/${guild._id}`]);
    await this.sounds.success();
  }

  public updatePresence(args: Args.PresenceUpdate) {
    this.userService.upsert(args.userId, { status: args.status });
  }

  public updateUser(args: Args.UserUpdate) {
    const user = this.userService.self;
    this.userService.upsert(user._id, args.partialUser);
  }
}
