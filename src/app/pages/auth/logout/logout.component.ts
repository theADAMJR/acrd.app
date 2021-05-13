import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GuildService } from '../../../services/api/guild.service';
import { UserService } from '../../../services/api/user.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(
    private router: Router,
    private userService: UserService) {}

  public async ngOnInit() {
    localStorage.removeItem('key');
    
    this.userService.self = null; 

    this.router.navigate(['/']);
  }
}
