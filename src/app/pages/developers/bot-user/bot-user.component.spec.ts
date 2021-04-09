import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { BotUserComponent } from './bot-user.component';

describe('BotUserComponent', () => {
  let component: BotUserComponent;
  let fixture: ComponentFixture<BotUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BotUserComponent ],
      imports: [AppModule],
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
