import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { MeSidebarComponent } from './me-sidebar.component';
import { AppModule } from '../../../app.module';

describe('DashboardSidebarComponent', () => {
  let component: MeSidebarComponent;
  let fixture: ComponentFixture<MeSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MeSidebarComponent ],
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
