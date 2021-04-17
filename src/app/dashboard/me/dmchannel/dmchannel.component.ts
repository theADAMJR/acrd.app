import { Component } from '@angular/core';
import { TextBasedChannel } from '../../text-based-channel';

@Component({
  selector: 'app-dmchannel',
  templateUrl: './dmchannel.component.html',
  styleUrls: ['./dmchannel.component.css']
})
export class DMChannelComponent extends TextBasedChannel {
  public async ngOnInit() {
    await super.init();
  }
}
