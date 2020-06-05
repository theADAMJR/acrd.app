import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelingModuleComponent } from './leveling-module.component';
import { environment } from 'src/environments/environment';
import { AppModule } from 'src/app/app.module';
import { FormGroup } from '@angular/forms';

describe('LevelingModuleComponent', () => {
  let component: LevelingModuleComponent;
  let fixture: ComponentFixture<LevelingModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelingModuleComponent ],
      imports: [ AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelingModuleComponent);
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
});
