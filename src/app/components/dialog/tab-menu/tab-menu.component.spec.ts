import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabMenuComponent } from './tab-menu.component';

describe('TabMenuComponent', () => {
  let component: TabMenuComponent;
  let fixture: ComponentFixture<TabMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
