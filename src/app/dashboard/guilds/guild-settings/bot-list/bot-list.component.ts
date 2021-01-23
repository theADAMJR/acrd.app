import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/dashboard/components/module-config';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-bot-list',
  templateUrl: './bot-list.component.html',
  styleUrls: [
    './bot-list.component.css',
    '../../guild-settings/overview/guild-settings.component.css'
  ]
})
export class BotListComponent extends ModuleConfig implements OnInit {
  bots: any[];
  selectedBot: any;

  botInGuild = false;

  constructor(
    route: ActivatedRoute,
    router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    private userService: UsersService) {
      super(guildService, route, snackbar, ws, log, router);
    }

  async ngOnInit() {
    await super.init();
    await this.userService.init();
    
    this.bots = await this.userService.getBots();
    this.selectBot(this.bots[0]);

    this.botInGuild = this.selectedBot
      && this.guild.members.some(m => m.user._id === this.selectedBot._id);;
    
    this.hookWSEvents();
  }

  hookWSEvents() {
    // throw new Error('Method not implemented.');
  }

  buildForm() {
    return new FormGroup({});
  }

  selectBot(user: any) {
    this.selectedBot = user;
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
