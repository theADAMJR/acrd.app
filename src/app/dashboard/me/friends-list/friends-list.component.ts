import { Component, Input } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { LogService } from 'src/app/services/log.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  @Input() tab: TabType;

  get friends() {
    return this.userService.getFriends();
  }
  get onlineFriends() {
    return this.userService
      .getFriends()
      .filter(f => f.status !== 'OFFLINE');
  }
  get friendRequests() {
    return this.userService.user?.friendRequests;
  }

  constructor(
    public channelService: ChannelService,
    public userService: UsersService,
    private ws: WSService) {}

  getFriendRequest(id: string) {
    return this.friendRequests.find(r => r.userId === id);
  }
  getFriend(id: string) {
    return this.friends.find(f => f._id === id);
  }

  acceptFriendRequest(friendId: string) {
    this.ws.emit('ACCEPT_FRIEND_REQUEST', { friendId });
  }

  cancelFriendRequest(friendId: string) {
    this.ws.emit('CANCEL_FRIEND_REQUEST', { friendId });
  }

  removeFriend(friendId: string) {
    this.ws.emit('REMOVE_FRIEND', { friendId });
  }
}

export type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'BLOCKED';