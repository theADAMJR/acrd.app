import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
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
import { Lean, patterns } from 'src/app/types/entity-types';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent extends UserConfig implements AfterViewInit {
  @ViewChild('themeSelect')
  public themeSelect: MatSelect;
  public environment = environment;
  public defaultTheme = 'CLONE';

  public get sfxEnabled() {
    return localStorage.getItem('sfx') !== 'disabled';
  }
  public get currentTheme() {
    return localStorage.getItem('theme');
  }
  public get avatarUser() {
    return {
      avatarURL: this.form.get('avatarURL').value,
      username: this.user.username,
    };
  }

  constructor(
    route: ActivatedRoute,
    router: Router,
    usersService: UsersService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    public themes: ThemeService,
    private usernameValidators: UsernameValidators,
  ) {
    super(usersService, route, snackbar, ws, log, router);
  }

  public async ngAfterViewInit() {
    await super.init();

    this.themeSelect
      ?.writeValue(localStorage
        .getItem('theme') ?? this.defaultTheme);

    this.themes.updateTheme();    
  }

  public buildForm(user: Lean.User): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      avatarURL: new FormControl(user.avatarURL, [
        Validators.required,
      ]),
      username: new FormControl(user.username, [
        Validators.required,
        Validators.maxLength(32),
        Validators.pattern(patterns.username),
      ], [ this.usernameValidators.shouldBeUnique.bind(this.usernameValidators) ]),
    });
  }

  public toggleSounds(enabled: boolean) {    
    (enabled)
      ? localStorage.setItem('sfx', 'enabled')
      : localStorage.setItem('sfx', 'disabled')
  }

  public async submit() {
    await super.submit();
  }

  public setAvatar(name: string) {        
    this.form
      .get('avatarURL')
      .setValue(`${environment.endpoint}/avatars/${name}.png`);
  }
}
