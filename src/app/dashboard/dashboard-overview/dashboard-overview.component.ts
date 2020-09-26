import { Component } from '@angular/core';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.css']
})
export class DashboardOverviewComponent {
  get user() { return this.userService.user; }

  constructor(private userService: UsersService) {
    document.title = 'DClone - Dashboard';
  }
}
