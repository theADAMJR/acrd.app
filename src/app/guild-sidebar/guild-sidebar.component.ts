import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  get guild() {
    const id = this.route.snapshot.paramMap.get('id');    
    return this.auth.getGuild(id);
  }

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute,
    private router: Router) {
      document.title = '2PG - Dashboard';
    }

  async ngOnInit() {
    if (this.guild) return;
    
    await this.auth.updateGuilds();
    if (!this.guild) {
      this.router.navigate(['/dashboard']);
    }
  }
}
