import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModuleConfig } from '../module-config';
import { GuildService } from '../guild.service';

@Component({
  selector: 'app-general-module',
  templateUrl: './general-module.component.html',
  styleUrls: ['./general-module.component.css']
})
export class GeneralModuleComponent extends ModuleConfig implements OnInit {
  form = new FormGroup({
    prefix: new FormControl('', [
      Validators.required, 
      Validators.maxLength(5) 
    ]),
    ignoredChannels: new FormControl(''),
    autoRoles: new FormControl('')
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

    this.initFormValues();
  }

  private initFormValues() {
    this.form.get('prefix').setValue(super.guild.prefix);
    this.form.get('ignoredRoles').setValue(super.guild.ignoredRoles);
    this.form.get('autoRoles').setValue(super.guild.autoRoles);
  }
}
