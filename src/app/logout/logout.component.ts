import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private router: Router) {}

  async ngOnInit() {
    localStorage.removeItem('key');
    
    await this.auth.updateUser();
    await this.auth.updateGuilds();

    this.router.navigate(['/']);
  }
}
