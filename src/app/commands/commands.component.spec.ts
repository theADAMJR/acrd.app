import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsComponent } from './commands.component';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';

describe('CommandsComponent', () => {
  let component: CommandsComponent;
  let fixture: ComponentFixture<CommandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandsComponent ],
      imports: [ HttpClientModule, MatSnackBarModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
