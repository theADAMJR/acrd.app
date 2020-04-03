import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import { FormGroup, FormControl, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ModuleConfig } from '../module-config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../services/guild.service';

@Component({
  selector: 'app-commands-module',
  templateUrl: './commands-module.component.html',
  styleUrls: ['./commands-module.component.css']
})
export class CommandsModuleComponent extends ModuleConfig implements OnInit {
  moduleName = 'commands';

  commands = [];
  commandConfigs: CommandConfig[] = [];

  form = new FormGroup({
    configs: new FormArray([])
  });
  get commandsFormArray() { return this.form.get('configs') as FormArray; }

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar,
    private service: CommandsService) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    this.commands = await this.service.get();
    for (const command of this.commands)
      this.commandsFormArray.push(new FormGroup({
        name: new FormControl(command.name),
        enabled: new FormControl(true)
      }));

    await super.init();
  }
  
  protected initFormValues() {
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
