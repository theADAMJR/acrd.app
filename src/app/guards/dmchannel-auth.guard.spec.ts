import { TestBed } from '@angular/core/testing';

import { DMChannelAuthGuard } from './dmchannel-auth.guard';

describe('DMChannelAuthGuard', () => {
  let guard: DMChannelAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(DMChannelAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
