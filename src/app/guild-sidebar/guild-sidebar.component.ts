import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';
import config from 'config.json';

@Component({
  selector: 'guild-sidebar',
  templateUrl: './guild-sidebar.component.html',
  styleUrls: ['./guild-sidebar.component.css']
})
export class GuildSidebarComponent implements OnInit {
  modules = config.modules;
  otherModules = config.otherModules;

  get guild() {
    const id = this.route.snapshot.paramMap.get('id');    
    return this.auth.getGuild(id);
  }

  constructor(
    private auth: AuthService,
    private route: ActivatedRoute) {}

  ngOnInit(): void {
  }
}
