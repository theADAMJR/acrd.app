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
  public get mutualGuilds(): Lean.Guild[] {
    const otherGuilds = this.data.user.guilds;    
    return this.users.self.guilds
      .filter(ug => otherGuilds.some(og => og.id === ug.id));
  }

  public get isSelf() {
    return this.users.self.id === this.data.user.id;
  }

  constructor(
    public dialogRef: MatDialogRef<ProfileComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { user: Lean.User },
    private channels: ChannelService,
    private users: UserService,
  ) {}
}
