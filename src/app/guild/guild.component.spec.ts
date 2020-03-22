import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildComponent } from './guild.component';

describe('GuildComponent', () => {
  let component: GuildComponent;
  let fixture: ComponentFixture<GuildComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuildComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
