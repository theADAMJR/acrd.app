import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogModuleComponent } from './log-module.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../../app-routing.module';

describe('LogModuleComponent', () => {
  let component: LogModuleComponent;
  let fixture: ComponentFixture<LogModuleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogModuleComponent ],
      imports: [ HttpClientModule, AppRoutingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
