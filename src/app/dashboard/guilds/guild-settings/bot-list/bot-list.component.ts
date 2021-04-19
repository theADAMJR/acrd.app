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
  apps: Lean.Application[];
  selectedApp: Lean.Application;

  botInGuild = false;

  constructor(
    route: ActivatedRoute,
    router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    private dev: DevelopersService) {
      super(guildService, route, snackbar, ws, log, router);
    }

  async ngOnInit() {
    await super.init();
    
    this.apps = await this.dev.getAll();
    this.selectBot(this.apps[0]);

    this.botInGuild = this.selectedApp
      && this.guild.members.some(m => m.userId === this.selectedApp._id);
    
    this.hookWSEvents();
  }

  hookWSEvents() {
  }

  buildForm() {
    return new FormGroup({});
  }

  selectBot(app: Lean.Application) {
    this.selectedApp = app;
  }

  async addBot(botId: string) {
    this.botInGuild = true;
    
    await this.guildService.addBot(this.guild._id, botId);
    await this.guildService.updateGuilds();
  }

  async removeBot(botId: string) {
    this.botInGuild = false;

    await this.guildService.removeBot(this.guild._id, botId);
    await this.guildService.updateGuilds();
  }
}
