import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../module-config';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-xp-module',
  templateUrl: './xp-module.component.html',
  styleUrls: ['./xp-module.component.css']
})
export class XPModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'xp';

  form = new FormGroup({
    levelRoles: new FormArray([]),
    ignoredRoles: new FormControl(),
    xpPerMessage: new FormControl(),
    xpCooldown: new FormControl()
  });
  get commandsFormArray() { return this.form.get('configs') as FormArray; }

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
  }
  
  protected initFormValues() {
    const xp = this.savedGuild.xp;
    // only set if > 1
    this.form.controls.levelRoles.setValue(xp.levelRoles);
    this.form.controls.ignoredRoles.setValue(xp.ignoredRoles);
    this.form.controls.xpPerMessage.setValue(xp.xpPerMessage);
    this.form.controls.xpCooldown.setValue(xp.xpCooldown);
  }
}

export interface LevelRole {
  level: number;
  role: string;
}
