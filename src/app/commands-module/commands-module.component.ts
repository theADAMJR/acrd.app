import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSlideToggle } from '@angular/material/slide-toggle';

@Component({
  selector: 'app-commands-module',
  templateUrl: './commands-module.component.html',
  styleUrls: ['./commands-module.component.css']
})
export class CommandsModuleComponent implements OnInit {
  commands: any[];
  commandConfigs: CommandConfig[];
  guild: any;

  form = new FormGroup({});

  constructor(
    private auth: AuthService,
    private service: CommandsService,
    private route: ActivatedRoute) {}

  async ngOnInit() {
    this.commands = await this.service.get();

    const guildId = this.route.snapshot.paramMap.get('id');
    this.guild = await this.auth.getGuild(guildId);

    this.commandConfigs = this.guild.commands || [];

    for (const command of this.commands) {
      const config = this.commandConfigs.find(c => c.name === command.name);
      this.form.addControl(command.name, new FormControl(config?.enabled ?? true));
    }

    // this.form.valueChanges
      // .subscribe(() => confirm('Unsaved changes!'));
  }

  onChange(control: any) {
    alert(control.name);
  }

  submit(value: any) {
    console.log(value);    
  }
}

export interface CommandConfig {
  name: string;
  enabled: boolean;
}