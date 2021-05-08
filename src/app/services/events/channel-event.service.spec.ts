import { TestBed } from '@angular/core/testing';
import { AppModule } from 'src/app/app.module';
import { Lean } from 'src/app/types/entity-types';
import { AccordMock } from 'src/tests/accord-mock';
import { ChannelService } from '../channel.service';
import { GuildService } from '../guild.service';
import { MessageService } from '../message.service';
import { PingService } from '../ping.service';
import { UserService } from '../user.service';

import { ChannelEventService } from './channel-event.service';

describe('ChannelEventService', () => {
  let service: ChannelEventService;
  let userService: UserService;
  let messageService: MessageService;
  let channelService: ChannelService;
  let pingService: PingService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(ChannelEventService);
    messageService = TestBed.inject(MessageService);
    userService = TestBed.inject(UserService);
    pingService = TestBed.inject(PingService);

    userService.self = AccordMock.self();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('add message, message added to cache', async () => {
    const message = await addMessage();
    
    const messages = messageService.getAllCached(message.channelId);
    expect(messages).toContain(message);
  });
  
  it('add message, not ignored, ping called', () => {  
    const spy = spyOn(pingService, 'add');
    addMessage();
    
    expect(spy).not.toHaveBeenCalled();
  });
  
  it('add message, ignored, ping not called', async () => {
    const spy = spyOn(pingService, 'add');
    const message = await addMessage();

    userService.self.ignored.channelIds.push(message.channelId);
    service.addMessage({ message });
    
    expect(spy).toHaveBeenCalled();
  });
  
  it('add message, updates last message id in channel', async () => {
    const message = await addMessage();
    
    const channel = channelService.getCached(message.channelId);
    expect(channel.lastMessageId).toEqual(message._id);
  });
  
  it('delete message, removed from cache', async () => {
    const message = await addMessage();
    
    const messages = messageService.getAllCached(message.channelId);
    expect(messages).not.toContain(message);
  });
  
  it('update message, updated in cache', async () => {
    let message = await addMessage();
    message.content = 'hi';

    service.updateMessage({ message });
    
    message = messageService.getCached(message._id);
    expect(message.content).toEqual('hi');
  });
  
  it('start typing, calls channel service to start typing', () => {
    const spy = spyOn(channelService, 'startTyping');

    service.startTyping({
      channelId: AccordMock.snowflake(),
      userId: AccordMock.snowflake(),
    });

    expect(spy).toHaveBeenCalled();
  });

  async function addMessage() {
    const message = AccordMock.message();
    await service.addMessage({ message });

    return message;
  }
});
