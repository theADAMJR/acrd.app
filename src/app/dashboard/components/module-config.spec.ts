import { TestBed } from '@angular/core/testing';
import { AppModule } from '../../app.module';
import { ModuleConfig } from './module-config';

describe('ModuleConfig', () => {
  let service: ModuleConfig;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(ModuleConfig);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('')
});
