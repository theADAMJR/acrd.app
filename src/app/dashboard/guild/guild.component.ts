import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit {
  commands: any[]
  botNeedsPerms = false;
  guild: any;

  constructor(
    private guildService: GuildService,
    private route: ActivatedRoute) {}

  async ngOnInit() {
    this.route.paramMap.subscribe(async(paramMap) => {
      const id = paramMap.get('id');
      this.guild = this.guildService.getGuild(id);

      const { commands } = await this.guildService.getSavedLog(this.guild.id);
      this.commands = commands;

      const { hasAdmin } = await this.guildService.getBotStatus(id);
      this.botNeedsPerms = !hasAdmin;
    });
  }
}
