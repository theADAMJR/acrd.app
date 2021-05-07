import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';

import { MessageService } from './message.service';

describe('MessageService', () => {
  let service: MessageService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();
    service = TestBed.inject(MessageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
