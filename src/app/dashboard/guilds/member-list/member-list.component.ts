import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  @Input() guild: Lean.Guild;

  get onlineMembers() {
    return this.guild.members.filter(m => {
      const user = this.userService.getKnown(m.userId);
      return user.status !== 'OFFLINE';
    });
  }
  get offlineMembers() {
    return this.guild.members.filter(m => {
      const user = this.userService.getKnown(m.userId);
      return user.status === 'OFFLINE';
    });
  }

  constructor(
    public userService: UsersService,
  ) {}

  async ngOnInit() {
    await this.userService.init();
  }
}
