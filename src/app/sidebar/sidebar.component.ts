import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  get guilds() { return this.auth.guilds; }
  get user() { return this.auth.user; }

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
}
