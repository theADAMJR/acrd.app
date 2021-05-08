import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChannelService } from 'src/app/services/api/channel.service';
import { LogService } from 'src/app/services/log.service';
import { UserService } from 'src/app/services/api/user.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public get mutualFriends(): Lean.User[] {
    const otherFriendIds = this.data.user.friendIds;
    return this.users.self.friendIds
      .filter(id => otherFriendIds.includes(id))
      .map(id => this.users.getCached(id));
  }
  public get mutualGuilds(): Lean.Guild[] {
    const otherGuilds = this.data.user.guilds;    
    return this.users.self.guilds
      .filter(ug => otherGuilds.some(og => og._id === ug._id));
  }

  public get isSelf() {
    return this.users.self._id === this.data.user._id;
  }
  public get isFriend() {
    return this.users.self.friendIds.includes(this.data.user._id);
  }
  public get sentRequest() {
    return this.users.self.friendRequestIds.includes(this.data.user._id);
  }
  public get dmChannel() {
    return this.channels.getDM(this.data.user._id);
  }

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Lean.User },
    private channels: ChannelService,
    private users: UserService,
    private ws: WSService,
  ) {}

  public async addFriend() {
    await this.ws.emitAsync('ADD_FRIEND', {
      username: this.data.user.username,
    }, this);
  }

  public async removeFriend() {
    await this.ws.emitAsync('REMOVE_FRIEND', {
      friendId: this.data.user._id,
    }, this);
  }
}
