import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../../module-config';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'app-announce-module',
  templateUrl: './announce-module.component.html',
  styleUrls: ['./announce-module.component.css']
})
export class AnnounceModuleComponent extends ModuleConfig implements OnInit {
  EventType = EventType;

  moduleName = 'announce';

  events = [ EventType.MemberJoin, EventType.MemberLeave, EventType.MessageDeleted ];
  eventConfigs: AnnounceEvent[] = [];

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();    

    this.eventConfigs = this.savedGuild.announce.events;
  }

  buildForm() {
    const formGroup = new FormGroup({
      events: new FormArray([])
    });    
    for (const event of this.events)
      (formGroup.get('events') as FormArray).push(new FormGroup({
        event: new FormControl(event),
        enabled: new FormControl(false),
        channel: new FormControl(),
        message: new FormControl(`\`${this.EventType[event]}\` was triggered!`)
      }));
    return formGroup;
  }
  
  initFormValues(savedGuild: any) {    
    for (const event of this.events) {
      const config = savedGuild.announce.events.find(e => e.event === event);
      if (!config) continue;      
      
      const eventControl = (this.form.get('events') as FormArray)
        .get(config.event.toString());
      
      eventControl?.setValue({
        event,
        enabled: Boolean(config),
        channel: config.channel,
        message: `\`${this.EventType[event]}\` was triggered!`
      });
    }    
  }

  getEvent(eventType: EventType) {
    return this.eventConfigs.find(e => e.event === eventType);
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