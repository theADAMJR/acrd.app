import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusCardsComponent } from './plus-cards.component';

describe('PlusCardsComponent', () => {
  let component: PlusCardsComponent;
  let fixture: ComponentFixture<PlusCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlusCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
