import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoModModuleComponent } from './auto-mod-module.component';

describe('AutoModModuleComponent', () => {
  let component: AutoModModuleComponent;
  let fixture: ComponentFixture<AutoModModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoModModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoModModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
