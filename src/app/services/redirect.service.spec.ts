import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { RedirectService } from './redirect.service';

describe('RedirectService', () => {
  let service: RedirectService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(RedirectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
