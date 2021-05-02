import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
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
    private log: LogService,
    private userService: UserService,
  ) {}

  public async ngOnInit() {
    try {
      const key = this.route.snapshot.queryParamMap.get('key');
      localStorage.setItem('key', key);
    
      await this.userService.updateSelf();
      await this.guildService.fetchAll();
      
      await this.router.navigate(['/channels/@me']);
    } catch(error) {
      await this.log.error(error.message);
      await this.router.navigate(['/']);
    }
  }
}