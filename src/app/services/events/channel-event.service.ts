import { Injectable } from '@angular/core';
import { SoundService } from '../sound.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelEventService {
  constructor(
    private sounds: SoundService,
  ) {}

  public async ping() {
    await this.sounds.ping();
  }
}
