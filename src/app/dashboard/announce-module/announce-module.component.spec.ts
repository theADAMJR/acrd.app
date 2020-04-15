import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceModuleComponent, AnnounceEvent, EventType } from './announce-module.component';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from '../../app-routing.module';
import { ReactiveFormsModule, FormArray } from '@angular/forms';
import { environment } from 'src/environments/environment';

describe('AnnounceModuleComponent', () => {
  let component: AnnounceModuleComponent;
  let fixture: ComponentFixture<AnnounceModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnounceModuleComponent ],
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
    fixture = TestBed.createComponent(AnnounceModuleComponent);
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
    component = new AnnounceModuleComponent({} as any, {} as any, {} as any);
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
