import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Args } from 'src/app/types/ws-types';
import { ChannelService } from '../channel.service';
import { MessageService } from '../message.service';
import { SoundService } from '../sound.service';
import { UsersService } from '../users.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelEventService {
  private get activeChannelId() {
    return this.route.snapshot.paramMap.get('channelId');
  }

  constructor(
    private route: ActivatedRoute,
    private sounds: SoundService,
    private channelService: ChannelService,
    private messageService: MessageService,
    private usersService: UsersService,
  ) {}

  public async ping(args: Args.Ping) {
    const channelIsActive = this.activeChannelId === args.channelId;
    if (!channelIsActive)
      await this.sounds.ping();
  }

  public async addMessage({ message }: Args.MessageCreate) { 
    this.messageService.add(message);
  }

  public deleteMessage({ channelId, messageId }: Args.MessageDelete) {
    const messages = this.messageService.getAll(channelId);
    const index = messages.findIndex(m => m._id === messageId);

    messages.splice(index, 1);
  }

  public updateMessage({ message }: Args.MessageUpdate) {
    const messages = this.messageService.getAll(message.channelId);
    let index = messages.findIndex(m => m._id === message._id);

    messages[index] = message;
  }

  public startTyping({ channelId, userId }: Args.TypingStart) {
    this.channelService.startTyping(channelId, userId);
  }
}
