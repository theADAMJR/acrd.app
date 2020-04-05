import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  get user() { return this.userService.user; }

  constructor(private userService: UserService) {
    document.title = '2PG - Dashboard';
  }

  ngOnInit() {
  }
}
