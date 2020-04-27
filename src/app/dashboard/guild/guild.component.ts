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

  get guild() {
    const id = this.route.snapshot.paramMap.get('id');    
    return this.guildService.getGuild(id);
  }

  constructor(
    private guildService: GuildService,
    private route: ActivatedRoute) {}

  async ngOnInit() {
    const { commands } = await this.guildService.getSavedLog(this.guild.id);
    this.commands = commands;
  }
}
