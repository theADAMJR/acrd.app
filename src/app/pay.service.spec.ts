import { TestBed } from '@angular/core/testing';

import { PayService } from './pay.service';

describe('PayService', () => {
  let service: PayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
