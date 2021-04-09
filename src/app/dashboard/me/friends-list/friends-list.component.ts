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

  public get friends() {
    return this.userService.getFriends();
  }
  public get onlineFriends() {
    return this.userService
      .getFriends()
      .filter(f => f.status !== 'OFFLINE');
  }
  public get friendRequests() {
    return this.userService.user?.friendRequests;
  }

  constructor(
    public channelService: ChannelService,
    public userService: UsersService,
    private ws: WSService,
  ) {}

  public ngOnInit() {
    this.hookWSEvents();
  }

  public hookWSEvents() {
    this.ws
      .once('ACCEPT_FRIEND_REQUEST', this.acceptFriendRequest, this)
      .once('CANCEL_FRIEND_REQUEST', this.updateFriends, this)
      .once('REMOVE_FRIEND', this.updateFriends, this)
      .once('SEND_FRIEND_REQUEST', this.sendFriendRequest, this);
  }
  
  public acceptFriendRequest({ sender, friend, dmChannel }: Args.AcceptFriendRequest) {
    this.channelService.dmChannels.push(dmChannel);
    this.updateFriends({ sender, friend });
  }

  public sendFriendRequest({ sender, friend }: Args.AcceptFriendRequest) {
    this.userService.addKnownUser(friend);
    this.updateFriends({ sender, friend });
  }

  public updateFriends({ sender, friend }: { sender: Lean.User, friend: Lean.User }) {
    this.userService.upsertCached(sender._id, sender);
    this.userService.upsertCached(friend._id, friend);
  }

  public getFriendRequest(id: string) {
    return this.friendRequests.find(r => r.userId === id);
  }
  public getFriend(id: string) {
    return this.friends.find(f => f._id === id);
  }

  public accept(friendId: string) {
    this.ws.emit('ACCEPT_FRIEND_REQUEST', { friendId });
  }
  public cancel(friendId: string) {
    this.ws.emit('CANCEL_FRIEND_REQUEST', { friendId });
  }
  public remove(friendId: string) {
    this.ws.emit('REMOVE_FRIEND', { friendId });
  }
}

export type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'BLOCKED';