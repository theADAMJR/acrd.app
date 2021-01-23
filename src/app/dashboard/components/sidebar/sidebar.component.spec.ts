import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('toggle button click, should call toggle', () => {
    const spy = spyOn(component, 'toggle');
    let de = fixture.debugElement.query(By.css('button'));
    
    de.nativeElement.click();
    
    expect(spy).toHaveBeenCalled();
  })
});
