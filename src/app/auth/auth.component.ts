import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { GuildService } from '../services/guild.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private guildService: GuildService,
    private userService: UserService) {}

  async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    try {
      const key = await this.auth.authenticate(code);
  
      localStorage.setItem('key', key);
    
      await this.userService.updateUser();
      await this.guildService.updateGuilds();
      
      this.router.navigate(['/dashboard']);
    } catch {
      alert('Invalid key');
      this.router.navigate(['/']);      
    }
  }
}
