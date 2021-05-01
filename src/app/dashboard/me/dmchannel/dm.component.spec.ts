import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DMComponent } from './dm.component';

describe('DMChannelComponent', () => {
  let component: DMComponent;
  let fixture: ComponentFixture<DMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DMComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
