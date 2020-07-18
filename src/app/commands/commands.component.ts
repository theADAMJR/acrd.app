import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import { sentenceToCamelCase, kebabToCamelCase } from '../utils';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  commands = [];
  displayedCommands = [];
  modules = [
    { name: 'autoMod', icon: 'fa-gavel' },
    { name: 'general', icon: 'fa-star' },
    { name: 'leveling', icon: 'fa-trophy' },
    { name: 'music', icon: 'fa-music' }
  ];
  selectedModule = '';

  constructor(private service: CommandsService) {}

  async ngOnInit() {
    await this.service.init();

    this.commands = this.displayedCommands = this.service.commands;

    document.title = '2PG - Commands';

    this.setModule('autoMod');
  }

  setModule(name: string) {
    this.selectedModule = name;
    this.displayedCommands = this.commands
      .filter(c => kebabToCamelCase(c.module) === name);    
  }

  search(query: string) {
    const empty = query.trim().length <= 0;
    if (empty)
      return this.setModule(this.modules[0].name);

    this.displayedCommands = this.service.search(query);
    this.selectedModule = '';
  }
}
