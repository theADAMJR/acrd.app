import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';

import { DevelopersService } from './developers.service';

describe('DevelopersService', () => {
  let service: DevelopersService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();
    service = TestBed.inject(DevelopersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
