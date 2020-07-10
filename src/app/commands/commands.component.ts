import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import $ from 'jquery';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {
  commands = [];

  constructor(private service: CommandsService) {}

  async ngOnInit() { 
    this.commands = this.service.commands;

    document.title = '2PG - Commands';

    this.initCommands();
  }

  initCommands() {
    $('.categories li').on('click', function() {
      $('.categories li').removeClass('active');
      $(this).addClass('active');
    });

    this.setCategory('autoMod');
  }

  setCategory(name: string) {
    $('.commands li').attr('hidden', '');
    $(`.commands .${name}`).removeAttr('hidden');

    $(`.commands .${name}`).addClass('active');
  }
}
