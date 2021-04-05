import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.css']
})
export class SettingsSidebarComponent {
  @Input() closeRedirect = '/channels/@me';
  @Input() tabType: TabType;
  @Input() id: string;

  public readonly tabs: Tabs = {
    guild: [
      { name: 'General', icon: 'fas fa-eye', href: () => `/channels/${this.id}/settings` },
      { name: 'Bots', icon: 'fas fa-robot', href: () => `/channels/${this.id}/bots` },
      { name: 'Invites', icon: 'fas fa-user-plus', href: () => `/channels/${this.id}/invites` },
      { name: 'Roles', icon: 'fas fa-at', href: () => `/channels/${this.id}/roles` },
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
  ) {
    document.body.onkeyup = ({ key }) => {
      if (key === 'Escape')
        this.close();
    };
  }

  public async close() {
    await this.router.navigate([this.closeRedirect]); // TODO: redirect to previous page
  }
}

export type TabType = 'guild' | 'user';
export interface Tab {
  icon: string;
  name: string;
  href: (id: string) => string;
}
type Tabs = { [k in TabType]: Tab[] };