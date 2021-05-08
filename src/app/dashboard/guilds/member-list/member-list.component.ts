import { Component, Input, OnInit } from '@angular/core';
import { ConfigService } from 'src/app/services/config.service';
import { UserService } from 'src/app/services/api/user.service';
import { Lean } from 'src/app/types/entity-types';
import { widthExpandCollapse } from './member-list.animations';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  animations: [ widthExpandCollapse ],
})
export class MemberListComponent {
  @Input() public guild: Lean.Guild;

  private _expanded: boolean;
  public get isExpanded() {
    return this._expanded;
  }
  @Input('expanded')
  public set isExpanded(value: boolean) {
    this.config.set('memberListExpanded', this._expanded = value);
  }

  public get onlineMembers() {
    return this.guild.members.filter(m => {
      const user = this.userService.getCached(m.userId);
      return user.status === 'ONLINE';
    });
  }
  public get offlineMembers() {
    return this.guild.members.filter(m => {
      const user = this.userService.getCached(m.userId);
      return user.status === 'OFFLINE';
    });
  }

  constructor(
    public config: ConfigService,
    public userService: UserService,
  ) {
    this.isExpanded ||= this.config.get('memberListExpanded');
  }
}
