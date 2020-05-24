import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicModuleComponent } from './music-module.component';
import { By } from '@angular/platform-browser';
import { AppModule } from 'src/app/app.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('MusicModuleComponent', () => {
  let component: MusicModuleComponent;
  let fixture: ComponentFixture<MusicModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicModuleComponent ],
      imports: [ AppModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('refresh button updates tracks', () => {
    const el = fixture.debugElement.query(By.css('#refresh')).nativeElement;
    const spy = spyOn(component as any, 'updateList');

    el.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('stop button calls service.stop', () => {
    const el = fixture.debugElement.query(By.css('#stop')).nativeElement;
    const spy = spyOn(component.service as any, 'stop');

    el.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('pause button toggles paused class', () => {
    const el = fixture.debugElement.query(By.css('#toggle')).nativeElement;

    el.click();

    expect(el.classList).toContain('fa-play');
  });

  it('pause button calls service.toggle', () => {
    const el = fixture.debugElement.query(By.css('#toggle')).nativeElement;
    const spy = spyOn(component.service as any, 'toggle');

    el.click();
    
    expect(spy).toHaveBeenCalled();
  });

  it('skip button calls service.skip', () => {
    const el = fixture.debugElement.query(By.css('#skip')).nativeElement;
    const spy = spyOn(component.service as any, 'skip');

    el.click();
    
    expect(spy).toHaveBeenCalled();
  });
  
  it('add button and calls service.play', () => {
    const el = fixture.debugElement.query(By.css('#play')).nativeElement;
    const spy = spyOn(component as any, 'play');

    el.click();
    
    expect(spy).toHaveBeenCalled();
  });
});
