import { TestBed } from '@angular/core/testing';

import { MyEventService } from './my-event.service';

describe('MyEventService', () => {
  let service: MyEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('add friend', () => {
    expect(service).toBeTruthy();
  });
});
