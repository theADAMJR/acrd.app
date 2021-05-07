import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { CanDeactivateDashboard } from './can-deactivate-dashboard.guard';

describe('SaveChangesGuard', () => {
  let guard: CanDeactivateDashboard;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();
    guard = TestBed.inject(CanDeactivateDashboard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
