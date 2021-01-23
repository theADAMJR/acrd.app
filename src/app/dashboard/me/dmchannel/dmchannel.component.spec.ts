import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DMChannelComponent } from './dmchannel.component';

describe('DMChannelComponent', () => {
  let component: DMChannelComponent;
  let fixture: ComponentFixture<DMChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMChannelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
