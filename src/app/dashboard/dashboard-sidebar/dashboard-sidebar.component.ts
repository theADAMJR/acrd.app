import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'dashboard-sidebar',
  templateUrl: './dashboard-sidebar.component.html',
  styleUrls: ['./dashboard-sidebar.component.css']
})
export class DashboardSidebarComponent implements OnInit {
  get user() { return this.userService.user ?? {}; }

  constructor(private userService: UserService) {
    document.title = '2PG - Dashboard';
  }

  ngOnInit(): void {
  }

}
