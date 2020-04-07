import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import config from 'config.json';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  get githubURL() { return config.githubURL; }

  get user() { return this.userService.user; }

  constructor(private userService: UserService) {}

  ngOnInit() {
  }
}
