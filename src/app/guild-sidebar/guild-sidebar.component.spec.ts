import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuildSidebarComponent } from './guild-sidebar.component';
import { HttpClientModule } from '@angular/common/http';

describe('GuildSidebarComponent', () => {
  let component: GuildSidebarComponent;
  let fixture: ComponentFixture<GuildSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuildSidebarComponent ],
      imports: [ HttpClientModule ]
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
});
