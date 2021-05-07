import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';

import { MyEventService } from './my-event.service';

describe('MyEventService', () => {
  let service: MyEventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    service = TestBed.inject(MyEventService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('add friend', () => {
    expect(service).toBeTruthy();
  });
});
