import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsComponent } from './docs.component';
import { AppRoutingModule } from '../app-routing.module';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

describe('DocsComponent', () => {
  let component: DocsComponent;
  let fixture: ComponentFixture<DocsComponent>;
  let activatedRouteStub = new ActivatedRoute();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocsComponent ],
      imports: [
        AppRoutingModule
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { value: ActivatedRoute, useValue: activatedRouteStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('no page route parameter, redirects to default page', () => {
    const result = component.markdownPagePath$;

    expect(result).toContain(component.defaultPage);
  });
});
