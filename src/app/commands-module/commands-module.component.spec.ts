import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsModuleComponent } from './commands-module.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

describe('CommandsModuleComponent', () => {
  let component: CommandsModuleComponent;
  let fixture: ComponentFixture<CommandsModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandsModuleComponent ],
      imports: [ 
        HttpClientModule, 
        AppRoutingModule, 
        FormsModule, 
        ReactiveFormsModule 
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
