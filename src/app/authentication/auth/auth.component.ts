import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { GuildService } from '../../services/guild.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private guildService: GuildService,
    private userService: UserService) {}

  async ngOnInit() {
    try {
      const key = this.route.snapshot.queryParamMap.get('key');
      localStorage.setItem('key', key);
    
      await this.userService.updateSelf();
      await this.guildService.fetchAll();
      
      this.router.navigate(['/channels/@me']);
    } catch {
      alert('Invalid key - check console');
      this.router.navigate(['/']);
    }
  }
}