import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Args } from 'src/app/types/ws-types';
import { ChannelService } from '../channel.service';
import { MessageService } from '../message.service';
import { SoundService } from '../sound.service';
import { UserService } from '../user.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelEventService {
  constructor(
    private sounds: SoundService,
    private channelService: ChannelService,
    private messageService: MessageService,
  ) {}

  public async ping(args: Args.Ping) {
    await this.sounds.ping();
  }

  public async addMessage({ message }: Args.MessageCreate) { 
    this.messageService.overrideAdd([message]);
  }

  public deleteMessage({ channelId, messageId }: Args.MessageDelete) {
    const messages = this.messageService.getAllCached(channelId);
    const index = messages.findIndex(m => m._id === messageId);

    messages.splice(index, 1);
  }

  public updateMessage({ message }: Args.MessageUpdate) {
    const messages = this.messageService.getAllCached(message.channelId);
    let index = messages.findIndex(m => m._id === message._id);

    messages[index] = message;
  }

  public startTyping({ channelId, userId }: Args.TypingStart) {
    this.channelService.startTyping(channelId, userId);
  }
}
