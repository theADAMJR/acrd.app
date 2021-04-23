import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { UsersService } from 'src/app/services/users.service';
import { Args, WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent implements OnInit {
  @Input()
  public tab: TabType;

  public get blockedUsers() {
    return this.users.user.ignored?.userIds
      ?.map(id => this.users.getKnown(id));
  }
  public get friendRequests() {
    return this.users.user.friendRequestIds
      .map(id => this.users.getKnown(id));
  }
  public get friends() {
    return this.users.getFriends();
  }
  public get onlineFriends() {
    return this.users
      .getFriends()
      .filter(f => f.status !== 'OFFLINE');
  }

  constructor(
    public channelService: ChannelService,
    public users: UsersService,
    private ws: WSService,
  ) {}

  public ngOnInit() {
    this.hookWSEvents();
  }

  public hookWSEvents() {
    this.ws
      .on('ADD_FRIEND', this.addFriend, this)
      .on('REMOVE_FRIEND', this.updateFriends, this);
  }
  
  public addFriend({ sender, friend, dmChannel }: Args.AddFriend) {
    this.channelService.dmChannels.push(dmChannel);
    this.updateFriends({ sender, friend });
  }

  public updateFriends({ sender, friend }: { sender: Lean.User, friend: Lean.User }) {
    this.users.upsertCached(sender._id, sender);
    this.users.upsertCached(friend._id, friend);
  }

  public getFriend(id: string) {
    return this.friends.find(f => f._id === id);
  }

  public add(username: string) {
    this.ws.emit('ADD_FRIEND', { username }, this);
  }
  public remove(friendId: string) {
    this.ws.emit('REMOVE_FRIEND', { friendId }, this);
  }

  public isOutgoing(friend: Lean.User) {
    return !friend.friendRequestIds.includes(this.users.user._id);
  }
}

export type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'BLOCKED';