import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent implements OnInit {
  get user() { return this.auth.user ?? {}; }

  constructor(private auth: AuthService) {
    document.title = '2PG - Dashboard';
  }

  ngOnInit(): void {
  }

}
