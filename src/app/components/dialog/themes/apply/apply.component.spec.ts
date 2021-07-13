import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplyComponent } from './apply.component';

describe('ApplyComponent', () => {
  let component: ApplyComponent;
  let fixture: ComponentFixture<ApplyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApplyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
