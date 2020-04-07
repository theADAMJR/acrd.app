import { TestBed } from '@angular/core/testing';

import { DashboardAuthGuard } from './dashboard-auth.guard';
import { HttpClientModule } from '@angular/common/http';

describe('DashboardAuthGuard', () => {
  let guard: DashboardAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
  });

  it('should be created', () => {
    const fakeAuth = {
      updateUser: () => {},
      user: null
    } as any;
    guard = new DashboardAuthGuard(fakeAuth);

    expect(guard).toBeTruthy();
  });

  it('null user is denied', async () => {
    const fakeAuth = {
      updateUser: () => {},
      user: null
    } as any;
    guard = new DashboardAuthGuard(fakeAuth);

    const result = await guard.canActivate();

    expect(result).toBeFalsy();
  });

  it('existing user is not denied', async () => {
    const fakeAuth = {
      updateUser: () => {},
      user: {}
    } as any;
    guard = new DashboardAuthGuard(fakeAuth);

    const result = await guard.canActivate();

    expect(result).toBeTruthy();
  });
});
