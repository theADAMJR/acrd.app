import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { AddFriendComponent } from '../dialog/add-friend/add-friend.component';
import { CreateChannelComponent } from '../dialog/create-channel/create-channel.component';
import { CreateGuildComponent } from '../dialog/create-guild/create-guild.component';
import { CreateInviteComponent } from '../dialog/create-invite/create-invite.component';
import { ProfileComponent } from '../dialog/profile/profile.component';
import { Lean } from '../types/entity-types';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  public openMenu(event: MouseEvent, menuTrigger: MatMenuTrigger) {
    event.preventDefault();
    menuTrigger.openMenu();
  }

  public createInvite(data: { guild: Lean.Guild }) {
    this.dialog.open(CreateInviteComponent, { width: '500px', data });
  }

  public createChannel(data: { guild: Lean.Guild }) {
    this.dialog.open(CreateChannelComponent, { width: '350px', data });
  }

  public profile(data: { user: Lean.User }) {
    this.dialog.open(ProfileComponent, { width: '500px', data });
  }

  public createGuild() {
    this.dialog.open(CreateGuildComponent, { width: '500px' });
  }

  public addFriend() {
    this.dialog.open(AddFriendComponent, { width: '350px' });
  }
}
