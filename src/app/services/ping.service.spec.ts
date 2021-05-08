import { TestBed } from '@angular/core/testing';
import { AccordMock } from 'src/tests/accord-mock';
import { AppModule } from '../app.module';
import { Lean, UserTypes } from '../types/entity-types';
import { ChannelService } from './channel.service';

import { PingService } from './ping.service';
import { SoundService } from './sound.service';
import { UserService } from './user.service';

describe('PingService', () => {
  let service: PingService;
  let userService: UserService;
  let message: Lean.Message;

  beforeEach(async() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    userService = {} as UserService;
    userService.updateSelf = (): any => {};
    userService.self = AccordMock.self();

    service = new PingService(
      TestBed.inject(SoundService),
      TestBed.inject(ChannelService),
      userService,
    );

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

  it('isGuildUnread(), no pings, returns false', () => {
    const guild = AccordMock.guild();
    expect(service.isGuildUnread(guild)).toBe(false);
  });

  it('isGuildUnread(), ping in channel, returns true', async () => {
    const { guild } = await addPing();
    expect(service.isGuildUnread(guild)).toBe(true);
  });

  it('lastUnread(), ping in channel, returns last read message', async () => {
    const { message } = await addPing();
    expect(service.lastRead(message.channelId)).toEqual(message._id);
  });

  it('isUnread(), ping in channel, returns true', async () => {
    const { message } = await addPing();
    expect(service.isUnread(message.channelId)).toBe(true);
  });

  it('markAsRead(), ping in channel, deletes ping', async () => {
    const { message } = await addPing();
    await service.markAsRead(message.channelId);

    expect(service.isUnread(message.channelId)).toBe(false);
  });

  it('markGuildAsRead(), ping in guild channel, deletes ping', async () => {
    const { message, guild } = await addPing();
    await service.markGuildAsRead(guild);

    expect(service.isUnread(message.channelId)).toBe(false);
  });

  async function addPing() {
    const guild = AccordMock.guild();
    const channel = AccordMock.channel(guild._id);
    guild.channels.push(channel);

    const message = AccordMock.message({ channelId: channel._id });
    await service.add(message);
    
    return { message, channel, guild };
  }
});
