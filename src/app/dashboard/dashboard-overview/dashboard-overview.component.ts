import { Component } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent {
  get user() { return this.userService.user; }

  constructor(private userService: UserService) {
    document.title = '2PG - Dashboard';
  }
}
