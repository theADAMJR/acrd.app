import { Component, EventEmitter, Input, Output } from '@angular/core';
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
}
