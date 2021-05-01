import { Component } from '@angular/core';
import { TextBasedChannel } from '../../text-based-channel';

@Component({
  selector: 'app-text-channel',
  templateUrl: './text-channel.component.html',
  styleUrls: ['./text-channel.component.css']
})
export class TextChannelComponent extends TextBasedChannel {}
