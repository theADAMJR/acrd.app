import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageEmbedComponent } from './message-embed.component';

describe('MessageEmbedComponent', () => {
  let component: MessageEmbedComponent;
  let fixture: ComponentFixture<MessageEmbedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessageEmbedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageEmbedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
