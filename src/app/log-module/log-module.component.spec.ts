import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogModuleComponent } from './log-module.component';

describe('LogModuleComponent', () => {
  let component: LogModuleComponent;
  let fixture: ComponentFixture<LogModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
