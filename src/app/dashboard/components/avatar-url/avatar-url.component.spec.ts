import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarUrlComponent } from './avatar-url.component';

describe('AvatarUrlComponent', () => {
  let component: AvatarUrlComponent;
  let fixture: ComponentFixture<AvatarUrlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarUrlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
