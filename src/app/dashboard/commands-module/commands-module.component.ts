import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../../services/commands.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModuleConfig } from '../../module-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'app-commands-module',
  templateUrl: './commands-module.component.html',
  styleUrls: ['./commands-module.component.css']
})
export class CommandsModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'commands';

  commands = [];
  commandConfigs: CommandConfig[] = [];

  get commandsFormArray() { return this.form.get('configs') as FormArray; }

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar,
    private service: CommandsService) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
  }

  async buildForm() { 
    const formGroup = new FormGroup({
      configs: new FormArray([])
    });

    this.commands = await this.service.get();
    for (const command of this.commands)
      (formGroup.get('configs') as FormArray).push(new FormGroup({
        name: new FormControl(command.name),
        enabled: new FormControl(true)
      }));
    return formGroup;
  }
  
  initFormValues() {
    this.commandConfigs = this.savedGuild.commands.configs || [];

    for (const config of this.commandConfigs) {
      const index = this.commandConfigs.indexOf(config);
      this.commandsFormArray.get(index.toString())?.setValue(config);
    }
  }
}

export interface CommandConfig {
  name: string;
  enabled: boolean;
}
