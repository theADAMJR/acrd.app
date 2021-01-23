import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateGuildModalComponent } from './create-guild-modal.component';

describe('CreateGuildModalComponent', () => {
  let component: CreateGuildModalComponent;
  let fixture: ComponentFixture<CreateGuildModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateGuildModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateGuildModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
