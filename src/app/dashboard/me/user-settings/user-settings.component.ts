import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { UsernameValidators } from 'src/app/authentication/sign-up/username.validators';
import { UserConfig } from 'src/app/dashboard/components/user-config';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent extends UserConfig implements OnInit {
  @ViewChild('themeSelect') themeSelect: MatSelect;

  environment = environment;

  defaultTheme = 'CLONE';
  
  constructor(
    route: ActivatedRoute,
    router: Router,
    usersService: UsersService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    public themes: ThemeService) {
      super(usersService, route, snackbar, ws, log, router);
    }

  async ngOnInit() {
    await super.init();
    await this.updateTakenUsernames();

    document.body.onkeyup = ({ key }) => {
      if (key !== 'Escape') return;

      this.close();
    };

    this.themeSelect.writeValue(localStorage.getItem('theme')
      ?? this.defaultTheme);

    this.themes.updateTheme();
  }

  public buildForm(user: any): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      avatarURL: new FormControl(user.avatarURL, [
        Validators.required,
        Validators.pattern(/[https://]/)
      ]),
      username: new FormControl(user.username, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(/(?=.*[a-zA-Z0-9!@#$%^&*])/gm),
      ], [ UsernameValidators.shouldBeUnique ])
    });
  }

  async updateTakenUsernames() {
    const usernames = await this.usersService.getUsernames();
    UsernameValidators.takenUsernames = (usernames ?? [])
      .filter(name => name !== this.user.username);
  }

  setAvatar(name: string) {
    this.form
      .get('avatarURL')
      .setValue(`${environment.endpoint}/avatars/${name}.png`);
  }
}
