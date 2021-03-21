import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotUserComponent } from './bot-user.component';

describe('BotUserComponent', () => {
  let component: BotUserComponent;
  let fixture: ComponentFixture<BotUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BotUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
