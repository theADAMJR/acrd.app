import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
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

  constructor(
    public config: ConfigService,
  ) {}
  
  public get memberIcon() {
    return (this.config.get('memberListExpanded'))
      ? 'lni-users'
      : 'lni-users text-muted';
  }
}
