import { TestBed } from '@angular/core/testing';

import { GuildService } from './guild.service';
import { HttpClientModule } from '@angular/common/http';

describe('GuildService', () => {
  let service: GuildService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(GuildService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
