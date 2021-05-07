import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { SoundService } from './sound.service';

describe('NotificationService', () => {
  let service: SoundService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();
    service = TestBed.inject(SoundService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
