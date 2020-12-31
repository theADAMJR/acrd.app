import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private userService: UsersService) {}

  async ngOnInit() {
    this.themeService.updateTheme();

    await this.userService.updateUser();
  } 
}
