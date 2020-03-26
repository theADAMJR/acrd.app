import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { LeaderboardModuleComponent } from './leaderboard-module.component';

describe('LeaderboardModuleComponent', () => {
  let component: LeaderboardModuleComponent;
  let fixture: ComponentFixture<LeaderboardModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderboardModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render total votes', () => {
    component.members = [{
      username: 'ADAMJR'
    }];
    component.guild = {};

    const debugEl = fixture.debugElement.query(By.css('.rank'));
    const el: HTMLElement = debugEl.nativeElement;
    
    expect(el.innerText).toContain('1');
  })
});
