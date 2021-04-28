import { Component, OnInit } from '@angular/core';
import { UsersService } from './services/users.service';
import { ThemeService } from './services/theme.service';
import { ActivatedRoute } from '@angular/router';
import { LogService } from './services/log.service';
import devtools from 'devtools-detect';
import { EventService } from './services/events/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public get sfxEnabled() {
    return localStorage.getItem('sfx') !== 'disabled';
  }

  constructor(
    private eventService: EventService,
    private themeService: ThemeService,
    private userService: UsersService,
    private route: ActivatedRoute,
    private log: LogService,
  ) {}

  public async ngOnInit() {
    this.eventService.init();

    this.themeService.updateTheme();
    await this.userService.updateUser();
    
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
