import { TestBed } from '@angular/core/testing';

import { DevelopersAuthGuard } from './developers-auth.guard';

describe('DevelopersAuthGuard', () => {
  let guard: DevelopersAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DevelopersAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
