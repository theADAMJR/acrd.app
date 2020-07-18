import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReactionRolesModuleComponent } from './reaction-roles-module.component';

describe('ReactionRolesModuleComponent', () => {
  let component: ReactionRolesModuleComponent;
  let fixture: ComponentFixture<ReactionRolesModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReactionRolesModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReactionRolesModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
