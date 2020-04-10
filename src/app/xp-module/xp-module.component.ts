import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleConfig } from '../module-config';

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
    const formGroup = new FormGroup({
      levelRoles: new FormArray([]),
      ignoredRoles: new FormControl(),
      xpPerMessage: new FormControl(),
      xpCooldown: new FormControl()
    });

    if (this.form)
      for (let i = 0; i < this.levelRolesFormArray.length; i++)
        this.removeLevelRole(i);

    const levelRoles = this.savedGuild.xp.levelRoles;   
    for (let i = 0; i < levelRoles.length; i++)
      (formGroup.get('levelRoles') as FormArray)
        .push(new FormControl(levelRoles[i]));
      
    return formGroup;
  }
  
  protected initFormValues(savedGuild: any) {
    const xp = savedGuild.xp;
    this.levelRolesFormArray.setValue(xp.levelRoles);
    this.form.controls.ignoredRoles.setValue(xp.ignoredRoles);
    this.form.controls.xpPerMessage.setValue(xp.xpPerMessage);
    this.form.controls.xpCooldown.setValue(xp.xpCooldown);    
  }

  // input methods

  addLevelRole() {    
    this.levelRolesFormArray.push(new FormGroup({
      level: new FormControl(1, Validators.min(1)),
      role: new FormControl('')
    }));   

    this.savedGuild.xp.levelRoles.push({ level: 1, role: '0' });
  }

  removeLevelRole(index: number) {
    this.levelRolesFormArray.removeAt(index);
    
    this.savedGuild.xp.levelRoles.splice(index, 1);
  }
}

export interface LevelRole {
  level: number;
  role: string;
}
