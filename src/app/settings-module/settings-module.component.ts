import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { ModuleConfig } from '../module-config';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-settings-module',
  templateUrl: './settings-module.component.html',
  styleUrls: ['./settings-module.component.css']
})
export class SettingsModuleComponent extends ModuleConfig implements OnInit {
  form = new FormGroup({
    privateLeaderboard: new FormControl()
  });

  constructor(
    auth: AuthService,
    route: ActivatedRoute) {
    super(auth, route);
  }
}
