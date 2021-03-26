import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-settings-sidebar',
  templateUrl: './settings-sidebar.component.html',
  styleUrls: ['./settings-sidebar.component.css']
})
export class SettingsSidebarComponent {
  @Input() closeRedirect = '/channels/@me';
  @Input() tabType: TabType;

  public readonly tabs: Tabs = {
    guild: [
      { name: 'Overview', icon: 'fas fa-eye', href: '/channels/@me/settings' },
      { name: 'Account', icon: 'fas fa-lock', href: '/channels/@me/settings/account' },
    ],
    user: [
      { name: 'Overview', icon: 'fas fa-eye', href: '/channels/@me/settings' },
      { name: 'Account', icon: 'fas fa-lock', href: '/channels/@me/settings/account' },
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
  href: string;
}
type Tabs = { [k in TabType]: Tab[] };