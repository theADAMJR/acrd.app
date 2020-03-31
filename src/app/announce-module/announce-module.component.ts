import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../module-config';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../guild.service';

@Component({
  selector: 'app-announce-module',
  templateUrl: './announce-module.component.html',
  styleUrls: ['./announce-module.component.css']
})
export class AnnounceModuleComponent extends ModuleConfig implements OnInit {
  events = Object.values(EventType)
    .splice(0, Object.keys(EventType).length / 2);

  form = new FormGroup({
    events: new FormControl('')
  });

  constructor(
    auth: AuthService,
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(auth, guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
  }

  getEvent(eventName: string) {
    this.guild?.announce.events
      .find(e => e.event.toString() === eventName);
  }
}

export enum EventType { MemberJoin, MemberLeave, MessageDeleted }