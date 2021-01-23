import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DashboardSidebarComponent } from './me-sidebar.component';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardSidebarComponent', () => {
  let component: DashboardSidebarComponent;
  let fixture: ComponentFixture<DashboardSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardSidebarComponent ],
      imports: [ HttpClientModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
