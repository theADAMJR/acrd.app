import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextChannelComponent } from './text-channel.component';

describe('TextChannelComponent', () => {
  let component: TextChannelComponent;
  let fixture: ComponentFixture<TextChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
