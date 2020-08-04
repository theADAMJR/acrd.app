import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusPaywallComponent } from './plus-paywall.component';

describe('PlusPaywallComponent', () => {
  let component: PlusPaywallComponent;
  let fixture: ComponentFixture<PlusPaywallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlusPaywallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusPaywallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
