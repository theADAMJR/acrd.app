import { TestBed } from '@angular/core/testing';
import { AppModule } from '../app.module';
import { WSService } from './ws.service';

describe('WSService', () => {
  let service: WSService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
    service = TestBed.inject(WSService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
