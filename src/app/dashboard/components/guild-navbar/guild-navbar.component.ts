import { Component, Input } from '@angular/core';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-navbar',
  templateUrl: './guild-navbar.component.html',
  styleUrls: ['./guild-navbar.component.css']
})
export class GuildNavbarComponent {
  @Input() activeChannel: Lean.Channel;
  @Input() guild: Lean.Guild;

  public toggleMemberList() {
    document
      .querySelector('.member-list').classList
      .toggle('d-none');
  }
}
