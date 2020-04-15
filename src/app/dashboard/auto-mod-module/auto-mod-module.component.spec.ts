import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutoModModuleComponent } from './auto-mod-module.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../../app-routing.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material-module';

describe('AutoModModuleComponent', () => {
  let component: AutoModModuleComponent;
  let fixture: ComponentFixture<AutoModModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutoModModuleComponent ],
      imports: [
        HttpClientModule,
        AppRoutingModule,
        MaterialModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutoModModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
