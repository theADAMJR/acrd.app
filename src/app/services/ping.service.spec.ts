import { TestBed } from '@angular/core/testing';
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
    TestBed.configureTestingModule({
      imports: [AppModule],
    });
    service = TestBed.inject(PingService);
    userService = TestBed.inject(UserService);

    user = userService.self;
    user.username = 'test_user_123';
    user.ignored = {
      channelIds: [],
      guildIds: [],
      userIds: [],
    };
    
    message = {
      _id: 'test_message_123',
      channelId: 'test_channel_123',
      createdAt: new Date(),
      authorId: user.username,
      content: 'hi',
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isIgnored(), not ignored returns false', () => {
    expect(service.isIgnored(message)).toBe(false);
  });

  it('isIgnored(), channel ignored returns true', () => {
    user.ignored.channelIds.push(message.channelId);

    expect(service.isIgnored(message)).toBe(true);
  });

  it('isIgnored(), guild ignored returns true', () => {
    const guildId = 'test_guild_123';
    user.ignored.guildIds.push(guildId);

    expect(service.isIgnored(message, guildId)).toBe(true);
  });

  it('isIgnored(), user ignored returns true', () => {
    user.ignored.userIds.push(message.authorId);

    expect(service.isIgnored(message)).toBe(true);
  });
});
