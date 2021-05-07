import { TestBed } from '@angular/core/testing';
import { AccordMock } from 'src/tests/accord-mock';
import { AppModule } from '../app.module';
import { Lean, UserTypes } from '../types/entity-types';

import { PingService } from './ping.service';
import { UserService } from './user.service';

describe('PingService', () => {
  let service: PingService;
  let userService: UserService;
  let message: Lean.Message;
  let user: UserTypes.Self;

  beforeEach(async() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(PingService);
    userService = TestBed.inject(UserService);
    userService.self = AccordMock.self();

    message = AccordMock.message();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isIgnored(), not ignored returns false', () => {
    expect(service.isIgnored(message)).toBe(false);
  });

  it('isIgnored(), channel ignored returns true', () => {
    userService.self.ignored.channelIds.push(message.channelId);

    expect(service.isIgnored(message)).toBe(true);
  });

  it('isIgnored(), guild ignored returns true', () => {
    const guildId = 'test_guild_123';
    userService.self.ignored.guildIds.push(guildId);

    expect(service.isIgnored(message, guildId)).toBe(true);
  });

  it('isIgnored(), user ignored returns true', () => {
    userService.self.ignored.userIds.push(message.authorId);

    expect(service.isIgnored(message)).toBe(true);
  });
});
