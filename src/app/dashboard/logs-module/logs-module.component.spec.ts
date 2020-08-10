import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogsModuleComponent, AnnounceEvent, EventType } from './logs-module.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from '../../app-routing.module';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';

describe('LogModuleComponent', () => {
  let component: LogsModuleComponent;
  let fixture: ComponentFixture<LogsModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogsModuleComponent ],
      imports: [ 
        HttpClientModule,
        MatSnackBarModule, 
        AppRoutingModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogsModuleComponent);
    component = fixture.componentInstance;
    component.guildId = environment.test.guildId;
    fixture.detectChanges();

    component.init = async() => {};
    component.savedGuild = { announce: { events: {}}};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('saved guild overwrites default input values', () => {
    const events = [
    {
      event: EventType.MemberJoin,
      channel: '123',
      message: 'a'
    } as AnnounceEvent ];
    component.savedGuild = { announce: { events }};
    component.guildId = '123';

    const result = (component.form.get('events') as FormArray).get('0').value;

    expect(result).toEqual(events[0]);
  });

  it('submitting removes enabled property', () => {
    component = new LogsModuleComponent({} as any, {} as any, {} as any);
    const events = [
    {
      event: EventType.MemberJoin,
      channel: '123',
      enabled: false,
      message: 'a'
    } as AnnounceEvent ];

    component.form.setValue({ events });
    component.submit();

    const result = component.form.get('events').get('0').value.enabled;

    expect(result).toBeUndefined();
  });
});
