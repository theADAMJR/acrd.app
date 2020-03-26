import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPCardComponent } from './xp-card.component';

describe('XPCardComponent', () => {
  let component: XPCardComponent;
  let fixture: ComponentFixture<XPCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XPCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
