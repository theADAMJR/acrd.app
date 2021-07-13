import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { UsernameValidators } from 'src/app/pages/auth/sign-up/username.validators';
import { UserConfig } from 'src/app/pages/channels/components/user-config';
import { UserService } from 'src/app/services/api/user.service';
import { ConfigService } from 'src/app/services/config.service';
import { DialogService } from 'src/app/services/dialog.service';
import { LogService } from 'src/app/services/log.service';
import { ThemeService } from 'src/app/services/theme.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean, patterns } from 'src/app/types/entity-types';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent extends UserConfig implements AfterViewInit {
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
    public themes: ThemeService,
    private usernameValidators: UsernameValidators,
    route: ActivatedRoute,
    router: Router,
    userService: UserService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService,
  ) {
    super(userService, route, snackbar, ws, log, router);
  }

  public async ngAfterViewInit() {
    await super.init();
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
