import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPModuleComponent } from './xp-module.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';

describe('XPModuleComponent', () => {
  let component: XPModuleComponent;
  let fixture: ComponentFixture<XPModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPModuleComponent ],
      imports: [
        HttpClientModule,
        AppRoutingModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(XPModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
