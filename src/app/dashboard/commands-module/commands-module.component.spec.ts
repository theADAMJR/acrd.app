import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandsModuleComponent } from './commands-module.component';
import { AppModule } from 'src/app/app.module';

describe('CommandsModuleComponent', () => {
  let component: CommandsModuleComponent;
  let fixture: ComponentFixture<CommandsModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommandsModuleComponent ],
      imports: [ AppModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommandsModuleComponent);
    // component = new CommandsModuleComponent();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('reset should return object to initial state', async(done) => {
    // await component.init();
    
    const previousValue = component.form.value;

    component.savedGuild = { commands: { configs: [] }};
    component.form.setValue({ configs: [] });
    component.reset();

    expect(component.form.value).toEqual(previousValue);
    done();
  });
});
