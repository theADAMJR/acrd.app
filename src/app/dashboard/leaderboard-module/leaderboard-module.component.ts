import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'app-leaderboard-module',
  templateUrl: './leaderboard-module.component.html',
  styleUrls: ['./leaderboard-module.component.css']
})
export class LeaderboardModuleComponent implements OnInit {
  members: any;
  guild: any = {};

  constructor(
    private guildService: GuildService,
    private route: ActivatedRoute) {}

  async ngOnInit() {
    const guildId = this.route.snapshot.paramMap.get('id');

    this.members = await this.guildService.getMembers(guildId);
    this.guild = await this.guildService.getPublicGuild(guildId);
  }
}
