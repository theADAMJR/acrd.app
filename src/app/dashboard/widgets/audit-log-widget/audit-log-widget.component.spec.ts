import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditLogWidgetComponent } from './audit-log-widget.component';

describe('AuditLogWidgetComponent', () => {
  let component: AuditLogWidgetComponent;
  let fixture: ComponentFixture<AuditLogWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuditLogWidgetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditLogWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
