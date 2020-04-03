import { Component, OnInit } from '@angular/core';
import { GuildService } from './services/guild.service';
import { UserService } from './services/user.service';

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
    try {
      await this.guildService.updateGuilds();
    } catch { alert('An error occurred loading guilds') }
  } 
}
