import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { DMChannelAuthGuard } from './dmchannel-auth.guard';

describe('DMChannelAuthGuard', () => {
  let guard: DMChannelAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    guard = TestBed.inject(DMChannelAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
