import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MemberUsernameComponent } from './member-username.component';

describe('MemberUsernameComponent', () => {
  let component: MemberUsernameComponent;
  let fixture: ComponentFixture<MemberUsernameComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MemberUsernameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MemberUsernameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
