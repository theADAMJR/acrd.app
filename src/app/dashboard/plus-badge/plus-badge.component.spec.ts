import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusBadgeComponent } from './plus-badge.component';

describe('PlusBadgeComponent', () => {
  let component: PlusBadgeComponent;
  let fixture: ComponentFixture<PlusBadgeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlusBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
