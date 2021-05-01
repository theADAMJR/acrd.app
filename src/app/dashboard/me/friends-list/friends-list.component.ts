import { Component, Input } from '@angular/core';
import { ChannelService } from 'src/app/services/channel.service';
import { LogService } from 'src/app/services/log.service';
import { UserService } from 'src/app/services/user.service';
import { Args, WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'friends-list',
  templateUrl: './friends-list.component.html',
  styleUrls: ['./friends-list.component.css']
})
export class FriendsListComponent {
  @Input() public tab: TabType;

  public get blockedUsers() {
    return this.users.self.ignored?.userIds
      ?.map(id => this.users.getCached(id));
  }
  public get onlineFriends() {
    return this.users.friends.filter(f => f.status !== 'OFFLINE');
  }

  constructor(
    public channelService: ChannelService,
    public users: UserService,
    private ws: WSService,
  ) {}

  public async add(username: string) {
    await this.ws.emitAsync('ADD_FRIEND', { username }, this);
  }
  public async remove(friendId: string) {
    await this.ws.emitAsync('REMOVE_FRIEND', { friendId }, this);
  }

  public isOutgoing(friend: Lean.User) {
    return this.users.self.friendRequestIds.includes(friend._id);
  }
}

export type TabType = 'ONLINE' | 'ALL' | 'PENDING' | 'BLOCKED';
