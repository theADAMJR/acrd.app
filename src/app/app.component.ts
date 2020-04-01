import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth.service';
import { GuildService } from './guild.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private guildService: GuildService,
    private userService: UserService) {}

  async ngOnInit() {
    await this.userService.updateUser();
    await this.guildService.updateGuilds();
  } 
}
