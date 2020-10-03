import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InviteModalComponent } from './invite-modal.component';

describe('InviteModalComponent', () => {
  let component: InviteModalComponent;
  let fixture: ComponentFixture<InviteModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InviteModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InviteModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
