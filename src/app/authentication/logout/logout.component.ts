import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuildService } from '../../services/guild.service';
import { UsersService } from '../../services/users.service';

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

  public async ngOnInit() {
    localStorage.removeItem('key');
    
    await this.userService.updateSelf();    
    await this.guildService.fetchAll();

    this.router.navigate(['/']);
  }
}
