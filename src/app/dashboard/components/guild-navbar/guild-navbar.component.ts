import { Component, EventEmitter, Input, Output } from '@angular/core';
import { getConfig } from 'src/app/config';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-navbar',
  templateUrl: './guild-navbar.component.html',
  styleUrls: ['./guild-navbar.component.css'],
})
export class GuildNavbarComponent {
  @Input() public activeChannel: Lean.Channel;
  @Input() public guild: Lean.Guild;
  @Output() public toggleMemberList = new EventEmitter();
  
  public get memberIcon() {
    return (getConfig('memberListExpanded'))
      ? 'lni-users'
      : 'lni-users text-muted';
  }
}
