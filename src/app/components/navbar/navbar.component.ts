import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/api/user.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  githubURL = environment.githubURL;

  get user() { return this.userService.self; }

  constructor(private userService: UserService) {}

  async ngOnInit() {
    await this.userService.init();
  }
}
