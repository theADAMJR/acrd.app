import { TestBed } from '@angular/core/testing';

import { DashboardAuthGuard } from './dashboard-auth.guard';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardAuthGuard', () => {
  let guard: DashboardAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    guard = TestBed.inject(DashboardAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
