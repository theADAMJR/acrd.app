import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessageComponent } from './message.component';
import { AppModule } from '../../../app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MessagePreviewComponent', () => {
  let component: MessageComponent;
  let fixture: ComponentFixture<MessageComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MessageComponent ],
      imports: [AppModule],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
