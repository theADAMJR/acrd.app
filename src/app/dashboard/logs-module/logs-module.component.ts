import { Component, OnInit } from '@angular/core';
import { ModuleConfig } from '../../module-config';
import { FormControl, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuildService } from '../../services/guild.service';

@Component({
  selector: 'app-announce-module',
  templateUrl: './logs-module.component.html',
  styleUrls: ['./logs-module.component.css']
})
export class LogsModuleComponent extends ModuleConfig implements OnInit {
  EventType = EventType;

  moduleName = 'logs';

  events = [
    EventType.Ban,
    EventType.ConfigUpdate,
    EventType.LevelUp,
    EventType.MemberJoin,
    EventType.MemberLeave,
    EventType.MessageDeleted,
    EventType.Unban,
    EventType.Warn,
    EventType.Test
  ];

  eventConfigs: AnnounceEvent[] = [];

  constructor(
    guildService: GuildService,
    route: ActivatedRoute,
    saveChanges: MatSnackBar) {
    super(guildService, route, saveChanges);
  }

  async ngOnInit() {
    await super.init();

    this.eventConfigs = this.savedGuild.logs.events;
  }

  buildForm({ logs }: any) {
    const formGroup = new FormGroup({
      events: new FormArray([])
    });
    for (let i = 0; i < this.events.length; i++) {
      const event = this.events[i];
      const config = logs.events.find(e => e.event === event); 

      (formGroup.get('events') as FormArray).push(new FormGroup({
        event: new FormControl(event),
        enabled: new FormControl(config?.enabled ?? false),
        channel: new FormControl(config?.channel ?? ''),
        message: new FormControl(config?.message ?? `\`${event}\` was triggered in **[GUILD]**!`, Validators.maxLength(512))
      }));     
    }
    return formGroup;
  }

  filterFormEvents(value: any) {
    value.events = value.events.filter(e => e?.enabled);
  }

  getEvent(eventType: EventType) {
    return this.eventConfigs.find(e => e.event === eventType);
  }

  async submit() {
    this.filterFormEvents(this.form.value);  
    await super.submit();
  }
}

export enum EventType {
  Ban = 'BAN', 
  ConfigUpdate = 'CONFIG_UPDATE',
  LevelUp = 'LEVEL_UP',
  MessageDeleted = 'MESSAGE_DELETED',
  MemberJoin = 'MEMBER_JOIN',
  MemberLeave = 'MEMBER_LEAVE',
  Unban = 'UNBAN', 
  Warn ='WARN',
  Test = 'TEST'
}

export interface AnnounceEvent {
  event: EventType;
  channel: string;
  message: string;
}
