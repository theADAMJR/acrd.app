import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPCardComponent } from './xp-card.component';
import { HttpClientModule } from '@angular/common/http';

describe('XPCardComponent', () => {
  let component: XPCardComponent;
  let fixture: ComponentFixture<XPCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPCardComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XPCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
