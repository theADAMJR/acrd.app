import { Component } from '@angular/core';
import { UserService } from 'src/app/services/api/user.service';
import { ConfigService } from 'src/app/services/config.service';
import { ThemeService } from 'src/app/services/theme.service';

@Component({
  selector: 'app-theme-apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.css']
})
export class ApplyComponent {  
  public defaultThemes = ['HORIZON', 'TWILIGHT'];

  constructor(
    public config: ConfigService,
    public themes: ThemeService,
    public userService: UserService,
  ) {}
}
