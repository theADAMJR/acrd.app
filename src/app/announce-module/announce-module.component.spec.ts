import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceModuleComponent } from './announce-module.component';

describe('AnnounceModuleComponent', () => {
  let component: AnnounceModuleComponent;
  let fixture: ComponentFixture<AnnounceModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnounceModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnounceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
