import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFriendComponent } from './add-friend.component';

describe('AddFriendComponent', () => {
  let component: AddFriendComponent;
  let fixture: ComponentFixture<AddFriendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFriendComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFriendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
