import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicModuleComponent } from './music-module.component';
import { HttpClientModule } from '@angular/common/http';

describe('MusicModuleComponent', () => {
  let component: MusicModuleComponent;
  let fixture: ComponentFixture<MusicModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MusicModuleComponent ],
      imports: [ HttpClientModule ]
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
});
