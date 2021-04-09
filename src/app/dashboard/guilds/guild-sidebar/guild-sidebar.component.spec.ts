import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GuildSidebarComponent } from './guild-sidebar.component';
import { AppModule } from '../../../app.module';

describe('GuildSidebarComponent', () => {
  let component: GuildSidebarComponent;
  let fixture: ComponentFixture<GuildSidebarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuildSidebarComponent ],
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('if no guild naviate to dashboard', () => {
  });
});
