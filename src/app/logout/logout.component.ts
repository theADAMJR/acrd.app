import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuildService } from '../services/guild.service';
import { UserAuthService } from '../services/user-auth.service';
import { UsersService } from '../services/users.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(
    private guildService: GuildService,
    private router: Router,
    private userService: UsersService) {}

  async ngOnInit() {
    localStorage.removeItem('key');
    
    await this.userService.updateUser();    
    await this.guildService.updateGuilds();

    this.router.navigate(['/']);
  }
}
