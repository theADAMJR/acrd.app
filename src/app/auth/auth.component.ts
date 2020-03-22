import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService) {}

  async ngOnInit() {
    const code = this.route.snapshot.queryParamMap.get('code');
    try {
      const key = await this.auth.authenticate(code);
  
      localStorage.setItem('key', key);
    
      await this.auth.updateUser();
      await this.auth.updateGuilds();
      
      this.router.navigate(['/dashboard']);
    } catch {
      alert('Invalid key');
      this.router.navigate(['/']); // TODO: send error - invalid key      
    }
  }
}
