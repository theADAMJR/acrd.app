import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { LogService } from 'src/app/services/log.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { UserConfig } from 'src/app/user-config';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent extends UserConfig implements OnInit {
  constructor(
    route: ActivatedRoute,
    router: Router,
    usersService: UsersService,
    snackbar: MatSnackBar,
    ws: WSService,
    log: LogService) {
      super(usersService, route, snackbar, ws, log, router);
    }

  async ngOnInit() {
    await super.init();

    document.body.onkeyup = ({ key }) => {
      if (key !== 'Escape') return;

      this.close();
    };
  }

  buildForm(user: any): FormGroup | Promise<FormGroup> {
    return new FormGroup({
      avatarURL: new FormControl(user.avatarURL, [
        Validators.required,
        Validators.pattern(/[https://]/)
      ]),
      username: new FormControl(user.username, [
        Validators.required,
        Validators.maxLength(32)
      ])
    });
  }
}
