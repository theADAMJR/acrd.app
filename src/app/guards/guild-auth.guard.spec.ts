import { TestBed } from '@angular/core/testing';
import { GuildAuthGuard } from './guild-auth.guard';
import { AppModule } from '../app.module';

describe('GuildAuthGuard', () => {
  let guard: GuildAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule]
    });
    guard = TestBed.inject(GuildAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('guild does not exist, returns false', () => {
    const result = guard.canActivate(null);

    expect(result).toBeFalse();
  });

  it('user not in guild, returns false', () => {
    const result = guard.canActivate(null);

    expect(result).toBeFalse();
  });

  it('user in guild and is not manager, returns false', () => {
    const result = guard.canActivate(null);

    expect(result).toBeFalse();
  });

  it('user in guild and is manager, returns true', () => {
    const result = guard.canActivate(null);

    expect(result).toBeTrue();
  });
});
