import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModuleConfig } from '../module-config';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../guild.service';

@Component({
  selector: 'app-settings-module',
  templateUrl: './settings-module.component.html',
  styleUrls: ['./settings-module.component.css']
})
export class SettingsModuleComponent extends ModuleConfig implements OnInit {
  form = new FormGroup({
    privateLeaderboard: new FormControl('')
  });

  constructor(
    auth: AuthService,
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(auth, guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
  }
}
