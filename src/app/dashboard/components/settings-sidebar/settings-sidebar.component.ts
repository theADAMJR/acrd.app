import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { PermissionsService } from 'src/app/services/permissions.service';
import { UsersService } from 'src/app/services/users.service';
import { PermissionTypes } from 'src/app/types/entity-types';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.css']
})
export class SettingsSidebarComponent {
  @Input() tabType: TabType;
  @Input('id') guildId: string;

  public readonly tabs: Tabs = {
    guild: [
      {
        name: 'General', 
        icon: 'fas fa-eye', 
        href: () => `/channels/${this.guildId}/settings`,
        permission: PermissionTypes.General.MANAGE_GUILD, 
      },
      {
        name: 'Bots',
        icon: 'fas fa-robot',
        href: () => `/channels/${this.guildId}/bots`,
        permission: PermissionTypes.General.MANAGE_GUILD, 
      },
      {
        name: 'Invites',
        icon: 'fas fa-user-plus',
        href: () => `/channels/${this.guildId}/invites`,
        permission: PermissionTypes.General.MANAGE_GUILD, 
      },
      {
        name: 'Roles',
        icon: 'fas fa-at',
        href: () => `/channels/${this.guildId}/roles`,
        permission: PermissionTypes.General.MANAGE_ROLES, 
      },
    ],
    user: [
      { name: 'Overview', icon: 'fas fa-eye', href: () => '/channels/@me/settings' },
      { name: 'Account', icon: 'fas fa-lock', href: () => '/channels/@me/settings/account' },
    ],
  };

  public get categories() {
    return Object.keys(this.tabs);
  }

  constructor(
    private router: Router,
    public perms: PermissionsService,
  ) {
    document.body.onkeyup = ({ key }) => {
      if (key === 'Escape')
        this.close();
    };
  }

  public async close() {
    const redirect = `/channels/${this.guildId ?? '@me'}`;
    await this.router.navigate([redirect]); // TODO: redirect to previous page
  }
}

export type TabType = 'guild' | 'user';
export interface Tab {
  icon: string;
  href: (id: string) => string;
  name: string;
  permission?: PermissionTypes.Permission;
}
type Tabs = { [k in TabType]: Tab[] };