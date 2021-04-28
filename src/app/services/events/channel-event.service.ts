import { Injectable } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Args } from 'src/app/types/ws-types';
import { SoundService } from '../sound.service';

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
  ) {}

  public async ping(args: Args.Ping) {
    const channelIsActive = this.activeChannelId === args.channelId;
    if (!channelIsActive)
      await this.sounds.ping();
  }
}
