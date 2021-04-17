import { Component, Input, OnInit } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { LogService } from 'src/app/services/log.service';
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
  public get friends() {
    return this.users.getFriends();
  }
  public get onlineFriends() {
    return this.users
      .getFriends()
      .filter(f => f.status !== 'OFFLINE');
  }
  public get friendRequests() {
    return this.users.user?.friendRequests;
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
      .on('ACCEPT_FRIEND_REQUEST', this.acceptFriendRequest, this)
      .on('CANCEL_FRIEND_REQUEST', this.updateFriends, this)
      .on('REMOVE_FRIEND', this.updateFriends, this)
      .on('SEND_FRIEND_REQUEST', this.sendFriendRequest, this);
  }
  
  public acceptFriendRequest({ sender, friend, dmChannel }: Args.AcceptFriendRequest) {
    this.channelService.dmChannels.push(dmChannel);
    this.updateFriends({ sender, friend });
  }

  public sendFriendRequest({ sender, friend }: Args.AcceptFriendRequest) {
    this.users.addKnownUser(friend);
    this.updateFriends({ sender, friend });
  }

  public updateFriends({ sender, friend }: { sender: Lean.User, friend: Lean.User }) {
    this.users.upsertCached(sender._id, sender);
    this.users.upsertCached(friend._id, friend);
  }

  public getFriendRequest(id: string) {
    return this.friendRequests.find(r => r.userId === id);
  }
  public getFriend(id: string) {
    return this.friends.find(f => f._id === id);
  }

  public accept(friendId: string) {
    this.ws.emit('ACCEPT_FRIEND_REQUEST', { friendId }, this);
  }
  public cancel(friendId: string) {
    this.ws.emit('CANCEL_FRIEND_REQUEST', { friendId }, this);
  }
  public remove(friendId: string) {
    this.ws.emit('REMOVE_FRIEND', { friendId }, this);
  }
}

export type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'BLOCKED';