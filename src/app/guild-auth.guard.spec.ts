import { TestBed } from '@angular/core/testing';

import { GuildAuthGuard } from './guild-auth.guard';

describe('GuildAuthGuard', () => {
  let guard: GuildAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuildAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
