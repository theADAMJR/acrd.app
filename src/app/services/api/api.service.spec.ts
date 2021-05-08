import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';

import { APIService } from './api.service';

describe('ApiService', () => {
  let service: APIService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();
    service = TestBed.inject(APIService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
