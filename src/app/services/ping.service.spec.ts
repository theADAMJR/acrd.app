import { TestBed } from '@angular/core/testing';
import { AccordMock } from 'src/tests/accord-mock';
import { AppModule } from '../app.module';
import { Lean } from '../types/entity-types';
import { ChannelService } from './api/channel.service';
import { MessageService } from './api/message.service';

import { PingService } from './ping.service';
import { SoundService } from './sound.service';
import { UserService } from './api/user.service';

describe('PingService', () => {
  let service: PingService;
  let channelService: ChannelService;
  let messageService: MessageService;
  let userService: UserService;
  let message: Lean.Message;

  beforeEach(async() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    channelService = TestBed.inject(ChannelService);
    messageService = TestBed.inject(MessageService);

    userService = {} as UserService;
    userService.fetchSelf = async () => AccordMock.self();
    userService.self = await userService.fetchSelf();

    service = new PingService(
      channelService,
      TestBed.inject(SoundService),
      userService,
    );

    message = AccordMock.message();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('init, adds unread pings to correct channels', async () => {
    const channel1 = addChannel();
    channel1.lastMessageId = addMessage({ channelId: channel1._id })._id;

    const channel2 = addChannel();
    const previousMessageId = addMessage({ channelId: channel2._id })._id;
    channel2.lastMessageId = addMessage({ channelId: channel2._id })._id;
    
    userService.self.lastReadMessages = {
      [channel1._id]: channel1.lastMessageId,
      [channel2._id]: previousMessageId,
    };

    await service.init();

    expect(service.isUnread(channel1._id)).toBe(false);
    expect(service.isUnread(channel2._id)).toBe(true);
  });

  it('init, no message in channel, marked as read', async () => {
    const channel = addChannel();
    userService.self.lastReadMessages = { [channel._id]: null };

    await service.init();

    expect(service.isUnread(channel._id)).toBe(false);
  });

  it('init, channel is ignored, ping not added', async () => {
    const channel = addChannel();
    const previousMessageId = AccordMock.snowflake();
    channel.lastMessageId = previousMessageId;

    userService.self.ignored.channelIds.push(channel._id);
    await service.init();

    expect(service.isUnread(channel._id)).toBe(false);
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

  function addChannel() {
    const guild = AccordMock.guild();
    const channel = AccordMock.channel(guild._id);
    guild.channels.push(channel);
    channelService.add(channel);

    return channel;
  }

  function addMessage(options?: Partial<Lean.Message>) {
    message = AccordMock.message(options);
    messageService.overrideAdd([message]);
        
    return message;
  }

  async function addPing() {
    const guild = AccordMock.guild();
    const channel = AccordMock.channel(guild._id);
    guild.channels.push(channel);

    const message = AccordMock.message({ channelId: channel._id });
    await service.add(message);
    
    return { message, channel, guild };
  }
});
