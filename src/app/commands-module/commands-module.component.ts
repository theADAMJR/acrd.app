import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ModuleConfig } from '../module-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../services/guild.service';

@Component({
  selector: 'app-commands-module',
  templateUrl: './commands-module.component.html',
  styleUrls: ['./commands-module.component.css']
})
export class CommandsModuleComponent extends ModuleConfig implements OnInit {
  commands: any[] = [];
  commandConfigs: CommandConfig[];
  form = new FormGroup({
    commands: new FormGroup({})
  });

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar,
    private service: CommandsService) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
    this.commands = await this.service.get();

    this.commandConfigs = super.guild.commands || [];
  }
  
  protected initFormValues() {
    for (const { name, enabled } of this.commandConfigs) {
      this.form.get('commands').get(name)
        .setValue({ name, enabled });
    }
  }
}

export interface CommandConfig {
  name: string;
  enabled: boolean;
}