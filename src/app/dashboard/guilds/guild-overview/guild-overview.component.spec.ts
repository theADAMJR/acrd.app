import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppModule } from '../../../app.module';
import { GuildOverviewComponent } from './guild-overview.component';

describe('GuildComponent', () => {
  let component: GuildOverviewComponent;
  let fixture: ComponentFixture<GuildOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuildOverviewComponent ],
      imports: [AppModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuildOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
