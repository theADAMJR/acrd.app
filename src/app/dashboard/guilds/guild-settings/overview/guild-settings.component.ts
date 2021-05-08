import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/dashboard/components/module-config';
import { GuildService } from 'src/app/services/api/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { Partial } from 'src/app/types/ws-types';

@Component({
  selector: 'app-guild-settings',
  templateUrl: './guild-settings.component.html',
  styleUrls: ['./guild-settings.component.css']
})
export class GuildSettingsComponent extends ModuleConfig implements OnInit {
  public get previewGuild() {
    return {
      ...this.guild,
      name: this.form.get('name').value || this.guild.name,
      iconURL: this.form.get('iconURL').value || this.guild.iconURL,
    };
  }

  constructor(
    route: ActivatedRoute,
    router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    ) {
      super(guildService, route, snackbar, ws, log, router);
    }

  public async ngOnInit() {
    await super.init();
  }

  public buildForm(guild: Partial.Guild): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      iconURL: new FormControl(guild.iconURL),
      name: new FormControl(guild.name, [ Validators.required, Validators.maxLength(32) ]),
    });
  }
}
