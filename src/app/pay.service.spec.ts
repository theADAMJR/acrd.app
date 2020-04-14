import { TestBed } from '@angular/core/testing';

import { PayService } from './pay.service';
import { HttpClientModule } from '@angular/common/http';

describe('PayService', () => {
  let service: PayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(PayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
