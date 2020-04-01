import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnounceModuleComponent } from './announce-module.component';
import { By } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';

describe('AnnounceModuleComponent', () => {
  let component: AnnounceModuleComponent;
  let fixture: ComponentFixture<AnnounceModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnounceModuleComponent ],
      imports: [ 
        HttpClientModule,
        MatSnackBarModule, 
        AppRoutingModule,
        ReactiveFormsModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnounceModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.ngOnInit = async () => {};
    component.guild = { announce: { events: {}}};
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('enable event, adds config to events array', () => {
    const toggleButton = fixture.debugElement.query(By.css('mat-slide-toggle'));
    const spy = spyOn(component, 'toggle');

    toggleButton.nativeElement.click();

    expect(spy).toHaveBeenCalled();
  });

  it('disable event, removes config from events array', () => {
    
  });
});
