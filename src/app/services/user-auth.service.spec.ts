import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { UserAuthService } from './user-auth.service';

describe('UserAuthService', () => {
  let service: UserAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    service = TestBed.inject(UserAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
