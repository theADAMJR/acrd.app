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
  let guildService: GuildService;
  let pingService: PingService;

  beforeEach(() => {
    TestBed
      .configureTestingModule({ imports: [AppModule] })
      .compileComponents();

    service = TestBed.inject(ChannelEventService);
    guildService = TestBed.inject(GuildService);
    messageService = TestBed.inject(MessageService);
    userService = TestBed.inject(UserService);
    pingService = TestBed.inject(PingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  it('add message, message added to cache', () => {
    const message = addMessage();
    
    const messages = messageService.getAllCached(message.channelId);
    expect(messages).toContain(message);
  });
  
  it('add message, not ignored, ping called', () => {  
    const spy = spyOn(pingService, 'add');
    addMessage();
    
    expect(spy).not.toHaveBeenCalled();
  });
  
  it('add message, ignored, ping not called', () => {
    const spy = spyOn(pingService, 'add');
    const message = AccordMock.message();

    userService.self.ignored.channelIds.push(message.channelId);
    service.addMessage({ message });
    
    expect(spy).toHaveBeenCalled();
  });
  
  it('delete message, removed from cache', () => {
    const message = addMessage();
    
    const messages = messageService.getAllCached(message.channelId);
    expect(messages).not.toContain(message);
  });
  
  it('update message, updated in cache', () => {
    let message = addMessage();
    message.content = 'hi';

    service.updateMessage({ message });
    
    message = messageService.getCached(message._id);
    expect(message.content).toEqual('hi');
  });
  
  it('start typing, updated in cache', () => {
    let message = addMessage();
    message.content = 'hi';

    service.updateMessage({ message });
    
    message = messageService.getCached(message._id);
    expect(message.content).toEqual('hi');
  });

  function addMessage() {
    const message = AccordMock.message();
    service.addMessage({ message });

    return message;
  }

  function addChannel() {
    const guild = AccordMock.guild();
    const channel = AccordMock.channel(guild._id);
    channelService.add(channel);
    return channel;
  }
});
