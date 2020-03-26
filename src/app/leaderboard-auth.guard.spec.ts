import { TestBed } from '@angular/core/testing';

import { LeaderboardAuthGuard } from './leaderboard-auth.guard';

describe('LeaderboardAuthGuard', () => {
  let guard: LeaderboardAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(LeaderboardAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
