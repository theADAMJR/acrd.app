import { TestBed } from '@angular/core/testing';

import { MusicService } from './music.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AppModule } from '../app.module';
import { Observable } from 'rxjs';

describe('MusicService', () => {
  let service: MusicService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ AppModule ],
      schemas: [ NO_ERRORS_SCHEMA ]
    });
    service = new MusicService({ get: () => new Observable((s) => s.complete()) } as any);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('toggle() sets pause to true', async() => {
    await service.toggle('123');

    expect(service.paused).toBe(true);
  });
  
  it('updateList() with list of 1 item, resets track', async() => {
    await service.toggle('123');
    await service.updateList('123');

    expect(service.paused).toBe(false);
    expect(service.current).toBe(0);
  });
  
  it('skip() resets current', async() => {
    await service.skip('123');

    expect(service.current).toBe(0);
  });
  
  it('seek() sets current to position', async() => {
    await service.seek('123', 123);

    expect(service.current).toBe(123);
  });
  
  it('stop() empties list', async() => {
    await service.stop('123');

    expect(service.list.length).toBe(0);
  });
});
