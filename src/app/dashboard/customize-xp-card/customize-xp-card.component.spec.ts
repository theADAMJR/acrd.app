import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomizeXPCardComponent } from './customize-xp-card.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';

describe('CustomizeXPCardComponent', () => {
  let component: CustomizeXPCardComponent;
  let fixture: ComponentFixture<CustomizeXPCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustomizeXPCardComponent ],
      imports: [ HttpClientModule, FormsModule, ReactiveFormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomizeXPCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on value change, xp card preview is updated', () => {
    const spy = spyOn(component, 'updatePreview').and.callThrough();

    component.form.get('primary').setValue('123');

    expect(spy).toHaveBeenCalled();
  });

  it('click button, submits form', () => {
    const spy = spyOn(component, 'submit').and.callThrough();
    const de = fixture.debugElement.query(By.css('#submit'));
    
    de.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });

  it('click stock image, setBackground is called', () => {
    const spy = spyOn(component, 'setBackground').and.callThrough();
    const de = fixture.debugElement.query(By.css('.stock-image'));

    de?.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });

  it('click stock image, updatePreview is called', () => {
    const spy = spyOn(component, 'updatePreview').and.callThrough();
    const de = fixture.debugElement.query(By.css('.stock-image'));

    de?.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
