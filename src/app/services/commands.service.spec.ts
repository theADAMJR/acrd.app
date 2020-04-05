import { TestBed } from '@angular/core/testing';

import { CommandsService } from './commands.service';
import { HttpClientModule } from '@angular/common/http';

describe('CommandsService', () => {
  let service: CommandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientModule ]
    });
    service = TestBed.inject(CommandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
