import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildSettingsComponent } from './guild-settings.component';

describe('GuildSettingsComponent', () => {
  let component: GuildSettingsComponent;
  let fixture: ComponentFixture<GuildSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildSettingsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
