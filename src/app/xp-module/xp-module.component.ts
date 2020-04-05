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

  get levelRolesFormArray() { return this.form.get('levelRoles') as FormArray; }

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
  }
  
  protected buildForm() {
    return new FormGroup({
      levelRoles: new FormArray([]),
      ignoredRoles: new FormControl(),
      xpPerMessage: new FormControl(),
      xpCooldown: new FormControl()
    });
  }
  
  protected initFormValues(savedGuild: any) {
    const xp = savedGuild.xp;
    this.form.controls.levelRoles.setValue(xp.levelRoles);
    this.form.controls.ignoredRoles.setValue(xp.ignoredRoles);
    this.form.controls.xpPerMessage.setValue(xp.xpPerMessage);
    this.form.controls.xpCooldown.setValue(xp.xpCooldown);
  }

  addLevelRole() {
    this.levelRolesFormArray.push(new FormGroup({
      level: new FormControl(1),
      role: new FormControl()
    }));
    this.savedGuild.xp.levelRoles.push({
      level: 1,
      role: '0'
    });
  }
}

export interface LevelRole {
  level: number;
  role: string;
}
