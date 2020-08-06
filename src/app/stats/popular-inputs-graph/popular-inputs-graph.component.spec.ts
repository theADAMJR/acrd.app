import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularInputsGraphComponent } from './popular-inputs-graph.component';

describe('PopularInputsGraphComponent', () => {
  let component: PopularInputsGraphComponent;
  let fixture: ComponentFixture<PopularInputsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularInputsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularInputsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
