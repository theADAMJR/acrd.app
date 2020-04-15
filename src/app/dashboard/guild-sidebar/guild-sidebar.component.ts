import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  @Input('waitFor') loaded = true;

  get guild() {
    const id = this.route.snapshot.paramMap.get('id');    
    return this.guildService.getGuild(id) || {};
  }

  constructor(
    private guildService: GuildService,
    private route: ActivatedRoute,
    private router: Router) {
      document.title = '2PG - Dashboard';
    }

  async ngOnInit() {
    if (!this.guild) {
      this.router.navigate(['/dashboard']);
    }
  }
}
