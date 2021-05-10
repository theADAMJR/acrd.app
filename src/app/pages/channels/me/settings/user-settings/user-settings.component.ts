import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { ThemeService } from 'src/app/services/theme.service';
import { UserService } from 'src/app/services/api/user.service';
import { WSService } from 'src/app/services/ws.service';
import { UsernameValidators } from 'src/app/pages/auth/sign-up/username.validators';
import { UserConfig } from 'src/app/pages/channels/components/user-config';
import { environment } from 'src/environments/environment';
import { Lean, patterns } from 'src/app/types/entity-types';
import faker from 'faker';
import { ConfigService } from 'src/app/services/config.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css'],
})
export class UserSettingsComponent extends UserConfig implements AfterViewInit {
  @ViewChild('themeSelect')
  public themeSelect: MatSelect;
  public environment = environment;
  public previewMessages: Lean.Message[] = [];

  public readonly avatarNames = [
    'avatar_aqua',
    'avatar_coffee',
    'avatar_fire',
    'avatar_gold',
    'avatar_grey',
    'avatar_rainbow',
    'avatar_sky',
    'avatar_tree',
  ];

  public get avatarUser() {
    return {
      avatarURL: this.form.get('avatarURL').value,
      username: this.user.username,
    };
  }

  constructor(
    public config: ConfigService,
    route: ActivatedRoute,
    router: Router,
    userService: UserService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
    public themes: ThemeService,
    private usernameValidators: UsernameValidators,
  ) {
    super(userService, route, snackbar, ws, log, router);
  }

  public async ngAfterViewInit() {
    await super.init();

    const messageCount = 3;
    for (let i = 0; i < messageCount; i++)
      this.previewMessages.push({
        authorId: this.user._id,
        content: faker.lorem.sentence(),
        channelId: '',
        createdAt: new Date(),
      } as any);      

    this.themeSelect
      ?.writeValue(localStorage
        .getItem('theme') ?? this.themes.defaultTheme);

    this.themes.init();    
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

  public setAvatar(name: string) {        
    this.form
      .get('avatarURL')
      .setValue(`${environment.endpoint}/avatars/${name}.png`);
  }
}
