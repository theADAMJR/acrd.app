import { TestBed } from '@angular/core/testing';
import { AccordMock } from 'src/tests/accord-mock';
import { AppModule } from '../../app.module';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(UserService);
    service.self = AccordMock.self();
    for (let i = 0; i < 5; i++)
      service.self.guilds.push(AccordMock.guild());
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('reorder, no change, returns', () => {
    const event = {
      previousIndex: 1,
      currentIndex: 1,
    } as any;
    const result = service.reorder('guilds', event);
    
    expect(result).toBe(undefined);
  });

  it('reorder, is changed, item is moved', () => {
    const prevItem = service.self.guilds[1];
    const event = {
      previousIndex: 1,
      currentIndex: 2,
    } as any;
    service.reorder('guilds', event);

    expect(prevItem).toEqual(service.self.guilds[2]);
  });
});
