import { TestBed } from '@angular/core/testing';

import { CanDeactivateDashboard } from './can-deactivate-dashboard.guard';

describe('SaveChangesGuard', () => {
  let guard: CanDeactivateDashboard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanDeactivateDashboard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
