import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leaderboard-module',
  templateUrl: './leaderboard-module.component.html',
  styleUrls: ['./leaderboard-module.component.css']
})
export class LeaderboardModuleComponent implements OnInit {
  members: any;
  guild: any = {};

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute) {}

  async ngOnInit() {
    const guildId = this.route.snapshot.paramMap.get('id');

    this.members = await this.auth.getMembers(guildId);
    this.guild = await this.auth.getPublicGuild(guildId);
  }
}
