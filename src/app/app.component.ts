import { Component, OnInit } from '@angular/core';
import { GuildService } from './services/guild.service';
import { UserService } from './services/user.service';
import { CommandsService } from './services/commands.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private commandService: CommandsService,
    private userService: UserService) {}

  async ngOnInit() {
    await this.commandService.updateCommands();
    await this.userService.updateUser();
    await this.userService.updateSavedUser();
  } 
}
