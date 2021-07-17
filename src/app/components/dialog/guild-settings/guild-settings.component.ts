import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-settings',
  templateUrl: './guild-settings.component.html',
  styleUrls: ['./guild-settings.component.css']
})
export class GuildSettingsComponent {
  public tabs = ['OVERVIEW', 'INVITES', 'ROLES'];
  public defaultTab = this.tabs[0];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { guild: Lean.Guild },
  ) {}
}
