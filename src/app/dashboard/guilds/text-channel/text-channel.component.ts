import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ParamMap } from '@angular/router';
import { TextBasedChannel } from '../../text-based-channel';

@Component({
  selector: 'app-text-channel',
  templateUrl: './text-channel.component.html',
  styleUrls: ['./text-channel.component.css']
})
export class TextChannelComponent extends TextBasedChannel {}
