import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PermissionsService } from 'src/app/services/permissions.service';
import { PermissionTypes } from 'src/app/types/entity-types';
import { UserService } from 'src/app/services/api/user.service';
import { GuildService } from 'src/app/services/api/guild.service';
import { RedirectService } from 'src/app/services/redirect.service';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.css'],
})
export class SettingsSidebarComponent implements OnInit {
  @Input() public tabType: TabType;
  @Input('id') public guildId: string;
  
  private get redirect() {
    return this.redirects.settingsRedirect
      ?? `/channels/${this.guildId || '@me'}`;
  }

  public readonly tabs: Tabs = {
    guild: [
      {
        name: 'General', 
        icon: 'lni lni-eye', 
        href: () => `/channels/${this.guildId}/settings`,
        permission: PermissionTypes.General.MANAGE_GUILD, 
      },
      // TODO: external links to bot websites
      // {
      //   name: 'Bots',
      //   icon: 'fas fa-robot',
      //   href: () => `/channels/${this.guildId}/bots`,
      //   permission: PermissionTypes.General.MANAGE_GUILD, 
      // },
      {
        name: 'Invites',
        icon: 'lni lni-user',
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
      { name: 'Overview', icon: 'lni lni-eye', href: () => '/channels/@me/settings' },
      { name: 'Account', icon: 'lni lni-lock', href: () => '/channels/@me/settings/account' },
    ],
  };

  public get categories() {
    return Object.keys(this.tabs);
  }

  public get tabCategory() {
    return (this.tabType === 'guild')
      ? this.guildService.getCached(this.guildId)?.name
      : this.userService.self.username;
  }

  constructor(
    private redirects: RedirectService,
    private guildService: GuildService,
    private perms: PermissionsService,
    private router: Router,
    private userService: UserService,
  ) {
    document.body.onkeyup = ({ key }) => {
      if (key === 'Escape')
        this.close();
    };
  }

  public ngOnInit() {
    this.redirects.settingsRedirect ??= this.redirects.previousURL;
  }

  public async close() {
    await this.router.navigate([ this.redirect ]);
  }

  public canAccess(tab: Tab) {
    return !tab.permission
      || this.perms.can(this.guildId, tab.permission);
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