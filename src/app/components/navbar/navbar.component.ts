import { Component, OnInit } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  githubURL = environment.githubURL;

  get user() { return this.userService.user; }

  constructor(private userService: UsersService) {}

  async ngOnInit() {
    await this.userService.init();
  }
}
