import { Component } from '@angular/core';

@Component({
  selector: 'app-guild-settings',
  templateUrl: './guild-settings.component.html',
  styleUrls: ['./guild-settings.component.css']
})
export class GuildSettingsComponent {
  public tabs = ['OVERVIEW', 'INVITES', 'ROLES'];
  public defaultTab = this.tabs[0];
}
