import { TestBed } from '@angular/core/testing';

import { CommandsService } from './commands.service';

describe('CommandsService', () => {
  let service: CommandsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommandsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
