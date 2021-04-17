import { TestBed } from '@angular/core/testing';

import { PingService } from './ping.service';

describe('NotificationService', () => {
  let service: PingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
