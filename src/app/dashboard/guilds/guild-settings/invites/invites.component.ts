import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ModuleConfig } from 'src/app/dashboard/components/module-config';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-invites',
  templateUrl: './invites.component.html',
  styleUrls: ['./invites.component.css', '../overview/guild-settings.component.css']
})
export class InvitesComponent extends ModuleConfig implements OnInit {
  constructor(
    route: ActivatedRoute,
    router: Router,
    guildService: GuildService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService) {
      super(guildService, route, snackbar, ws, log, router);
    }

  async ngOnInit() {
    await super.init();

    document.body.onkeyup = ({ key }) => {
      if (key !== 'Escape') return;

      this.close();
    };
  }

  buildForm(guild: Lean.Guild): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      name: new FormControl(guild.name, [ Validators.required, Validators.maxLength(32) ])
    });
  }
}
