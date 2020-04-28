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
    private userService: UserService) {}

  async ngOnInit() {
    await this.userService.updateUser();
  } 
}
