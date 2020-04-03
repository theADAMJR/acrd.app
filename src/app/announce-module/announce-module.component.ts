import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../module-config';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../services/guild.service';

@Component({
  selector: 'app-announce-module',
  templateUrl: './announce-module.component.html',
  styleUrls: ['./announce-module.component.css']
})
export class AnnounceModuleComponent extends ModuleConfig implements OnInit {
  EventType = EventType;

  moduleName = 'announce';

  events = [ EventType.MemberJoin, EventType.MemberLeave, EventType.MessageDeleted ];

  form = new FormGroup({
    events: new FormArray([])
  });
  get eventsFormArray () { return this.form.get('events') as FormArray; }

  eventConfigs: AnnounceEvent[] = [];

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    for (const event of this.events)
      this.eventsFormArray.push(new FormGroup({
        event: new FormControl(event),
        enabled: new FormControl(true),
        channel: new FormControl(),
        message: new FormControl(`\`${event}\` was triggered!`)
      }));

    await super.init();

    this.eventConfigs = this.savedGuild.announce.events;
  }
  
  protected initFormValues() {
    for (const event of this.events) {
      const config = this.getEvent(event);
      if (!config) continue;
      
      this.eventsFormArray.get(config.event.toString())?.setValue({
        event: new FormControl(event),
        enabled: new FormControl(Boolean(config)),
        channel: new FormControl(config.channel),
        message: new FormControl(`\`${event}\` was trigged!`)
      });
    }
  }

  getEvent(eventType: EventType) {
    return this.eventConfigs
      .find(e => e.event === eventType);
  }

  async submit() {
    const value = this.form.value;
    this.filterFormEvents(value);
    
    await this.guildService.saveGuild(this.guildId, this.moduleName, value);
  }

  private filterFormEvents(value: any) {
    const filteredEvents = [];
    for (const event of value.events.filter(e => e.enabled)) {
      const filtered = {...event};
      delete filtered.enabled;
      filteredEvents.push(filtered);
    }
    value.events = filteredEvents;
  }
}

export enum EventType { MemberJoin, MemberLeave, MessageDeleted }

export interface AnnounceEvent {
  event: EventType;
  channel: string;
  message: string;
}