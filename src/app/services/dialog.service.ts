import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuTrigger } from '@angular/material/menu';
import { CreateChannelComponent } from '../components/dialog/create-channel/create-channel.component';
import { CreateGuildComponent } from '../components/dialog/create-guild/create-guild.component';
import { CreateInviteComponent } from '../components/dialog/create-invite/create-invite.component';
import { ProfileComponent } from '../components/dialog/profile/profile.component';
import { Lean } from '../types/entity-types';
import { ChangelogComponent } from '../components/dialog/changelog/changelog.component';
import { UserSettingsComponent } from '../components/dialog/user-settings/user-settings.component';
import { GuildSettingsComponent } from '../components/dialog/guild-settings/guild-settings.component';

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

  public changelog() {
    this.dialog.open(ChangelogComponent, { width: '500px' });
  }

  public async userSettings() {
    this.dialog.open(UserSettingsComponent, { width: '750px' });
  }

  public async guildSettings() {
    this.dialog.open(GuildSettingsComponent, { width: '750px' });
  }
}
