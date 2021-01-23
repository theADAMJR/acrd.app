import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VoiceChannelComponent } from './voice-channel.component';

describe('VoiceChannelComponent', () => {
  let component: VoiceChannelComponent;
  let fixture: ComponentFixture<VoiceChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VoiceChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VoiceChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
