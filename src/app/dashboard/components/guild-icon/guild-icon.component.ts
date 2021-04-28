import { Component, Input } from '@angular/core';
import { DialogService } from 'src/app/services/dialog.service';
import { GuildService } from 'src/app/services/guild.service';
import { UsersService } from 'src/app/services/users.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-guild-icon',
  templateUrl: './guild-icon.component.html',
  styleUrls: ['./guild-icon.component.css']
})
export class GuildIconComponent {
  @Input() public guild: Lean.Guild;

  constructor(
    public dialogs: DialogService,
    public users: UsersService,
    public guildService: GuildService,
  ) {}
}
