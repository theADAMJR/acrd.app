import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WavesComponent } from './waves.component';

describe('WavesComponent', () => {
  let component: WavesComponent;
  let fixture: ComponentFixture<WavesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WavesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WavesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
