import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  public get mutualFriends(): Lean.User[] {
    const otherFriendIds = this.data.user.friendIds;
    return this.users.user.friendIds
      .filter(id => otherFriendIds.includes(id))
      .map(id => this.users.getKnown(id));
  }
  public get mutualGuilds(): Lean.Guild[] {
    const otherGuilds = this.data.user.guilds;
    return this.users.user.guilds
      .filter(g => otherGuilds.some(g => g?._id ?? g));
  }

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Lean.User },
    private users: UsersService
  ) {}
}
