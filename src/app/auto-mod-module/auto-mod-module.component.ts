import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../module-config';
import { FormGroup, FormArray } from '@angular/forms';
import { GuildService } from '../services/guild.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-auto-mod-module',
  templateUrl: './auto-mod-module.component.html',
  styleUrls: ['./auto-mod-module.component.css']
})
export class AutoModModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'autoMod';

  form = new FormGroup({
    
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
    
  }
}
