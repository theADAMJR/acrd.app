import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../../module-config';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { GuildService } from '../../services/guild.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auto-mod-module',
  templateUrl: './auto-mod-module.component.html',
  styleUrls: ['./auto-mod-module.component.css']
})
export class AutoModModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'autoMod';

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
      banWords: new FormControl(),
      autoDeleteMessages: new FormControl(),
      banLinks: new FormControl(),
      filters: new FormControl(),
      autoWarnUsers: new FormControl()
    });
  }
  
  protected initFormValues(savedGuild: any) {
    const autoMod = savedGuild.autoMod;
    this.form.controls.enabled.setValue(autoMod.enabled);
    this.form.controls.banWords.setValue(autoMod.banWords);
    this.form.controls.banLinks.setValue(autoMod.banLinks);
    this.form.controls.filters.setValue(autoMod.filters);
    this.form.controls.autoWarnUsers.setValue(autoMod.autoWarnUsers);
  }
}
