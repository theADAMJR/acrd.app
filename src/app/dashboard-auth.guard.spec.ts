import { TestBed } from '@angular/core/testing';

import { DashboardAuthGuard } from './dashboard-auth.guard';

describe('DashboardAuthGuard', () => {
  let guard: DashboardAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DashboardAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
