import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralModuleComponent } from './general-module.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { AppRoutingModule } from '../../app-routing.module';
import { environment } from 'src/environments/environment';

describe('GeneralModuleComponent', () => {
  let component: GeneralModuleComponent;
  let fixture: ComponentFixture<GeneralModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GeneralModuleComponent ],
      imports: [
        HttpClientModule,
        AppRoutingModule,
        MatSnackBarModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralModuleComponent);
    component = fixture.componentInstance;
    component.guildId = environment.test.guildId;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
