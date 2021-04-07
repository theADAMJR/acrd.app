import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css', '../overview/guild-settings.component.css']
})
export class InvitesComponent implements OnInit {
  public invites: Lean.Invite[];
  public guild: Lean.Guild;

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
  ) {}

  public async ngOnInit() {
    const guildId = this.route.snapshot.paramMap.get('guildId');
    this.guild = this.guildService.getGuild(guildId);
    this.invites = await this.guildService.getInvites(guildId);
  }
}
