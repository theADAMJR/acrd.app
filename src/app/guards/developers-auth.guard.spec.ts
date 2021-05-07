import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { DevelopersAuthGuard } from './developers-auth.guard';

describe('DevelopersAuthGuard', () => {
  let guard: DevelopersAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    guard = TestBed.inject(DevelopersAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
