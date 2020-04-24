import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { XPModuleComponent } from './xp-module.component';
import { environment } from 'src/environments/environment';
import { AppModule } from 'src/app/app.module';
import { FormGroup } from '@angular/forms';

describe('XPModuleComponent', () => {
  let component: XPModuleComponent;
  let fixture: ComponentFixture<XPModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ XPModuleComponent ],
      imports: [ AppModule ]
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

  it('buildForm returns valid form group', () => {
    expect(component.buildForm()).toBeInstanceOf(FormGroup);
  });

  it('initFormValues sets saved guild values', () => {
    component.initFormValues({ xp: { ignoredRoles: ['1'] }});

    const result = component.form.get('ignoredRoles').value;

    expect(result).toBe(['1']);
  })
});
