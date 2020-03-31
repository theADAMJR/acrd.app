import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guild',
  templateUrl: './guild.component.html',
  styleUrls: ['./guild.component.css']
})
export class GuildComponent implements OnInit {
  botNeedsPerms = false;

  get guild() {
    const id = this.route.snapshot.paramMap.get('id');    
    return this.auth.getGuild(id);
  }

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.setBotStatus();
  }

  private setBotStatus() {
        
  }
}
