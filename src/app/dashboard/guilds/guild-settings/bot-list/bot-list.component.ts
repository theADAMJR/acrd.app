import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/dashboard/components/module-config';
import { DevelopersService } from 'src/app/services/developers.service';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrls: [
    './bot-list.component.css',
    '../../guild-settings/overview/guild-settings.component.css'
  ]
})
export class BotListComponent extends ModuleConfig implements OnInit {
  public apps: Lean.Application[];
  public selectedApp: Lean.Application;

  public get botInGuild() {
    return this.guild.members.some(m => m.userId === this.selectedApp._id);
  }

  constructor(
    route: ActivatedRoute,
    router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    private dev: DevelopersService,
  ) {
    super(guildService, route, snackbar, ws, log, router);
  }

  public async ngOnInit() {
    await super.init();
    
    this.apps = await this.dev.fetchAll();
    this.selectedApp = this.apps[0];
  }

  public buildForm() {
    return new FormGroup({});
  }

  public async addBot(botId: string) {    
    await this.guildService.addBot(this.guildId, botId);
    await this.guildService.fetchAll();
  }

  public async removeBot(botId: string) {
    const member = this.guildService.getMember(this.guildId, botId);
    await this.guildService.kick(this.guildId, member._id);
    await this.guildService.fetchAll();
  }
}
