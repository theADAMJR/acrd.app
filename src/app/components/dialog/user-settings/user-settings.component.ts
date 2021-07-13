import { Component } from '@angular/core';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent {
  public tabs = ['OVERVIEW', 'PREFERENCES', 'ACCOUNT'];
  public defaultTab = this.tabs[0];
}

