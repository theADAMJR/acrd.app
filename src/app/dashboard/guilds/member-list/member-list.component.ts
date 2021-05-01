import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';
import { widthExpandCollapse } from './member-list.animations';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css'],
  animations: [ widthExpandCollapse ],
})
export class MemberListComponent {
  @Input() public expanded = true;
  @Input() public guild: Lean.Guild;

  public get onlineMembers() {
    return this.guild.members.filter(m => {
      const user = this.userService.getCached(m.userId);
      return user.status !== 'OFFLINE';
    });
  }
  public get offlineMembers() {
    return this.guild.members.filter(m => {
      const user = this.userService.getCached(m.userId);
      return user.status === 'OFFLINE';
    });
  }

  constructor(
    public userService: UsersService,
  ) {}
}
