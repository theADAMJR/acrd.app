import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Lean } from 'src/app/types/entity-types';
import { GuildService } from '../../../services/guild.service';

@Component({
  selector: 'app-guild',
  templateUrl: './guild-overview.component.html',
  styleUrls: ['./guild-overview.component.css']
})
export class GuildComponent implements OnInit {
  guild: Lean.Guild;

  constructor(
    private route: ActivatedRoute,
    private guildService: GuildService,
    private router: Router) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      const id = paramMap.get('guildId');
      this.guild = this.guildService.getGuild(id);
      
      const defaultChannel = this.guild.channels[0];      
      if (defaultChannel)
        this.router.navigate([`/channels/${id}/${defaultChannel._id}`]);
    });
  }
}
