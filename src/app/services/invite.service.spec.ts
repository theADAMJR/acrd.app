import { TestBed } from '@angular/core/testing';

import { InviteService } from './invite.service';

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
