import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildNavbarComponent } from './guild-navbar.component';

describe('GuildNavbarComponent', () => {
  let component: GuildNavbarComponent;
  let fixture: ComponentFixture<GuildNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GuildNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
