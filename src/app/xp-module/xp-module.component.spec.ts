import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPModuleComponent } from './xp-module.component';

describe('XPModuleComponent', () => {
  let component: XPModuleComponent;
  let fixture: ComponentFixture<XPModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XPModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
