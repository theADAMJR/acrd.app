import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveChangesComponent } from './save-changes.component';

describe('SaveChangesComponent', () => {
  let component: SaveChangesComponent;
  let fixture: ComponentFixture<SaveChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SaveChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
