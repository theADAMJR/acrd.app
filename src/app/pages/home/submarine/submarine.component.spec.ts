import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { SubmarineComponent } from './submarine.component';

describe('SubmarineComponent', () => {
  let component: SubmarineComponent;
  let fixture: ComponentFixture<SubmarineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubmarineComponent ],
      imports: [AppModule],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmarineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
