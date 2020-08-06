import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { CommandsService } from './services/commands.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private commandService: CommandsService,
    private themeService: ThemeService,
    private userService: UserService) {}

  async ngOnInit() {
    this.themeService.updateTheme();

    await this.commandService.updateCommands();
    await this.userService.updateUser();
  } 
}
