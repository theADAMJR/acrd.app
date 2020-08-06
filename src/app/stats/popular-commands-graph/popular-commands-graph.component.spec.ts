import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCommandsGraphComponent } from './popular-commands-graph.component';

describe('PopularCommandsGraphComponent', () => {
  let component: PopularCommandsGraphComponent;
  let fixture: ComponentFixture<PopularCommandsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PopularCommandsGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PopularCommandsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
