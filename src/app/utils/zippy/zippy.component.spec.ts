import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ZippyComponent } from './zippy.component';

describe('ZippyComponent', () => {
  let component: ZippyComponent;
  let fixture: ComponentFixture<ZippyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ZippyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZippyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
