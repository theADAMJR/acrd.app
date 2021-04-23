import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChannelTabComponent } from './channel-tab.component';

describe('ChannelTabComponent', () => {
  let component: ChannelTabComponent;
  let fixture: ComponentFixture<ChannelTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChannelTabComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChannelTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
