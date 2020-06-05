import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GuildService } from '../../services/guild.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleConfig } from '../../module-config';
import { slideUpDown } from './leveling-module.animations';

@Component({
  selector: 'app-leveling-module',
  templateUrl: './leveling-module.component.html',
  styleUrls: ['./leveling-module.component.css'],
  animations: [ slideUpDown ]
})
export class LevelingModuleComponent extends ModuleConfig implements OnInit {
  levelRoleIndices = [0,1,2,3,4,5,6,7];
  moduleName = 'leveling';

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
  
  buildForm({ leveling }: any) {
    const formGroup = new FormGroup({
      ignoredRoles: new FormControl(leveling.ignoredRoles ?? []),
      levelRoles: new FormArray([]),
      maxMessagesPerMinute: new FormControl(leveling.maxMessagesPerMinute ?? 3,
        [ Validators.min(1), Validators.max(30) ]),
      xpPerMessage: new FormControl(leveling.xpPerMessage ?? 50,
        [ Validators.min(0), Validators.max(10000) ])
    });
    this.buildLevelRolesFormArray(formGroup, leveling);
    return formGroup;
  }
  private buildLevelRolesFormArray(formGroup: FormGroup, leveling: any) {
    for (const i of this.levelRoleIndices)
      (formGroup.get('levelRoles') as FormArray)
        .setControl(i,
          (new FormGroup({
          level: new FormControl(leveling.levelRoles[i]?.level ?? 0, Validators.min(0)),
          role: new FormControl(leveling.levelRoles[i]?.role ?? '')
        })));
  }

  filterFormValue() {
    this.form.value.levelRoles = this.form.value.levelRoles
      .filter(c => c.level > 0);
  }

  getXPForLevel(level: any) {
    level = Number(level);
    return (75 * (level + 1)**2) + (75 * (level + 1)) - 150;
  }

  getHoursForLevel(level: number) {
    const xpPerMinute = this.form.value.xpPerMessage * this.form.value.maxMessagesPerMinute;
    const xpRequired = this.getXPForLevel(level);
    return xpRequired / (xpPerMinute * 60);
  }
}

export interface LevelRole {
  level: number;
  role: string;
}
