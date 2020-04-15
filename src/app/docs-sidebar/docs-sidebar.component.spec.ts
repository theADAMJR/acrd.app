import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsSidebarComponent } from './docs-sidebar.component';
import { By } from '@angular/platform-browser';
import { MaterialModule } from '../material-module';

describe('DocsSidebarComponent', () => {
  let component: DocsSidebarComponent;
  let fixture: ComponentFixture<DocsSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsSidebarComponent ],
      imports: [ MaterialModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on click, should open', () => {
    const spy = spyOn(component, 'toggle');
    const de = fixture.debugElement.query(By.css('button'));

    de.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });
});
