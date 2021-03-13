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

  get friends() { return this.userService.user?.friends; }
  get onlineFriends() {
    return this.userService.user?.friends.filter(f => f.status === 'ONLINE');
  }
  get friendRequests() { return this.userService.user?.friendRequests; }
  get blockedUsers() { return []; }

  constructor(
    public channelService: ChannelService,
    private log: LogService,
    public userService: UsersService,
    private ws: WSService) {}

  getFriendRequest(id: string) {
    return this.friendRequests.find(r => r.userId === id);
  }
  getFriend(id: string) {
    return this.friends.find(f => f._id === id);
  }

  acceptFriendRequest(friendId: string) {
    this.log.info('SEND ACCEPT_FRIEND_REQUEST', 'over');
    this.ws.emit('ACCEPT_FRIEND_REQUEST', { senderId: friendId, friendId: this.userService.user._id });
  }

  cancelFriendRequest(friendId: string) {
    this.log.info('SEND CANCEL_FRIEND_REQUEST', 'over');
    this.ws.emit('CANCEL_FRIEND_REQUEST', { senderId: this.userService.user._id, friendId });
  }

  removeFriend(friendId: string) {
    this.log.info('SEND REMOVE_FRIEND', 'over');
    this.ws.emit('REMOVE_FRIEND', { senderId: this.userService.user._id, friendId });
  }
}

export type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'BLOCKED';