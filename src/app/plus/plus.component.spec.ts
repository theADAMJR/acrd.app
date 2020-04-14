import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlusComponent } from './plus.component';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('PlusComponent', () => {
  let component: PlusComponent;
  let fixture: ComponentFixture<PlusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlusComponent ],
      imports: [
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('click pay button, calls checkout', async(done) => {
    const spy = spyOn(component, 'checkout');
    const de = fixture.debugElement.query(By.css('.checkout'));
    
    (de.nativeElement as HTMLElement).setAttribute('type', 'button');
    de.nativeElement.click();

    await expectAsync(spy).toBeResolved();
    done();
  })
});
