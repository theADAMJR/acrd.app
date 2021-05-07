import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { InviteService } from './invite.service';

describe('InviteService', () => {
  let service: InviteService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();
    service = TestBed.inject(InviteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
