import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../module-config';
import { FormControl, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../services/guild.service';

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

  eventConfigs = [];

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();
    
    this.eventConfigs = this.guild.announce.events;
  }
  
  protected initFormValues() {
    throw new Error("Method not implemented.");
  }

  getEvent(eventName: string) {
    this.eventConfigs
      .find(e => e.event.toString() === eventName);
  }

  toggle(eventName: any) {
    const event = this.getEvent(eventName);
    // (!event) ? this.createEvent() : removeEvent();
  }

  private createEvent(name: string) {
    
  }
}

export enum EventType { MemberJoin, MemberLeave, MessageDeleted }