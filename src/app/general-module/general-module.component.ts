import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleConfig } from '../module-config';
import { GuildService } from '../services/guild.service';

@Component({
  selector: 'app-general-module',
  templateUrl: './general-module.component.html',
  styleUrls: ['./general-module.component.css']
})
export class GeneralModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'general';

  get general() { return this.savedGuild.general; }

  form = new FormGroup({
    prefix: new FormControl('', [
      Validators.required, 
      Validators.maxLength(5) 
    ]),
    ignoredChannels: new FormControl(),
    autoRoles: new FormControl()
  });

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
  }
  
  protected initFormValues(savedGuild: any) {
    const general = savedGuild.general;
    this.form.controls.prefix.setValue(general.prefix);
    this.form.controls.ignoredChannels.setValue(general.ignoredChannels);
    this.form.controls.autoRoles.setValue(general.autoRoles);
  }
}
