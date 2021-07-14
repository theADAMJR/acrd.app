import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildSettingsOverviewComponent } from './overview.component';

describe('OverviewComponent', () => {
  let component: GuildSettingsOverviewComponent;
  let fixture: ComponentFixture<GuildSettingsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildSettingsOverviewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildSettingsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
