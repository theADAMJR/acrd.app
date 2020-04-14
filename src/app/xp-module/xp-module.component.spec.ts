import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPModuleComponent } from './xp-module.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { environment } from 'src/environments/environment';

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
    component.guildId = environment.test.guildId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
