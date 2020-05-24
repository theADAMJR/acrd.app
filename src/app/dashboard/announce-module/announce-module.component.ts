import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../../module-config';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
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

  buildForm({ announce }: any) {
    const formGroup = new FormGroup({
      events: new FormArray([])
    });
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const config = announce.events.find(e => e.event === event); 

      (formGroup.get('events') as FormArray).push(new FormGroup({
        event: new FormControl(event),
        enabled: new FormControl(Boolean(config?.channel && config?.message) ?? false),
        channel: new FormControl(config?.channel ?? ''),
        message: new FormControl(config?.message ?? `\`${event}\` was triggered in **[GUILD]**!`, Validators.maxLength(512))
      }));     
    }
    return formGroup;
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