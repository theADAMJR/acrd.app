import { Component, OnInit } from '@angular/core';
import { CommandsService } from '../services/commands.service';
import * as $ from 'jquery';
import 'datatables.net';

@Component({
  selector: 'app-commands',
  templateUrl: './commands.component.html',
  styleUrls: ['./commands.component.css']
})
export class CommandsComponent implements OnInit {

  commands: any[] = [];

  constructor(private service: CommandsService) {}

  async ngOnInit() {
    this.commands = await this.service.get()
    this.commands = this.commands.sort(a => a.name)

    document.title = '2PG - Commands';

    $(document).ready(() => $('table').DataTable());
  }
}
