import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/module-config';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-guild-settings',
  templateUrl: './guild-settings.component.html',
  styleUrls: ['./guild-settings.component.css']
})
export class RolesComponent extends ModuleConfig implements OnInit {
  constructor(
    route: ActivatedRoute,
    private router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService) {
      super(guildService, route, snackbar, ws, log);
    }

  async ngOnInit() {
    await super.init();

    document.body.onkeyup = ({ key }) => {
      if (key !== 'Escape') return;

      this.close();
    };
  }

  close() {
    this.router.navigate(['/channels/' + this.guild._id]);
  }

  async deleteGuild() {
    const confirmation = prompt(`Please type 'CONFIRM' if you wish to delete this guild.`);
    if (confirmation !== 'CONFIRM') return;

    await this.guildService.deleteGuild(this.guild._id);

    this.log.info('SEND GUILD_DELETE', 'gset');
    this.ws.socket.emit('GUILD_DELETE', { guild: this.guildId });

    const index = this.guildService.guilds.findIndex(g => g._id === this.guildId);
    this.guildService.guilds.splice(index, 1);

    await this.router.navigate(['/channels/@me']);
  }

  buildForm(guild: any): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      name: new FormControl(guild.name, [ Validators.required, Validators.maxLength(32) ])
    });
  }
}
