import { Component, OnInit } from '@angular/core';
import { UserService } from './services/user.service';
import { ThemeService } from './services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { LogService } from './services/log.service';
import devtools from 'devtools-detect';
import { EventService } from './services/events/event.service';
import { ConfigService } from './services/config.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(
    public config: ConfigService,
    private eventService: EventService,
    private themeService: ThemeService,
    private userService: UserService,
    private route: ActivatedRoute,
    private log: LogService,
  ) {}

  public async ngOnInit() {
    this.config.init();
    this.eventService.init();

    this.themeService.updateTheme();
    await this.userService.fetchSelf();
    
    this.handlePrompt();
    this.consoleWarning();
  }

  private handlePrompt() {
    this.route.queryParamMap.subscribe(async (map) => {
      const success = map.get('success');
      const error = map.get('error');
      if (success)
        await this.log.success(success);
      else if (error)
        await this.log.error(error);
    });
  }

  private consoleWarning() {
    const interval = setInterval(() => {
      if (!devtools.isOpen) return;

      this.log.consoleWarning();
      clearInterval(interval);
    }, 100);
  }
}
