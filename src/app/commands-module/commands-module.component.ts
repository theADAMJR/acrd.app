import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { ModuleConfig } from '../module-config';

@Component({
  selector: 'app-commands-module',
  templateUrl: './commands-module.component.html',
  styleUrls: ['./commands-module.component.css']
})
export class CommandsModuleComponent extends ModuleConfig {
  commands: any[] = [];
  commandConfigs: CommandConfig[];
  form = new FormGroup({});

  constructor(
    auth: AuthService,
    route: ActivatedRoute,
    private service: CommandsService) {
    super(auth, route);
  }

  async ngOnInit() {
    this.commands = await this.service.get();

    this.commandConfigs = super.guild.commands || [];

    for (const command of this.commands) {
      const config = this.commandConfigs.find(c => c.name === command.name);
      this.form.addControl(command.name, new FormControl(config?.enabled ?? true));
    }
  }
}

export interface CommandConfig {
  name: string;
  enabled: boolean;
}