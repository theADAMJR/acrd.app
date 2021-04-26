import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildIconComponent } from './guild-icon.component';

describe('GuildIconComponent', () => {
  let component: GuildIconComponent;
  let fixture: ComponentFixture<GuildIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildIconComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
