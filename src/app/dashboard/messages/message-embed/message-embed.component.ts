import { Component, EventEmitter, Input,  Output } from '@angular/core';

@Component({
  selector: 'message-embed',
  templateUrl: './message-embed.component.html',
  styleUrls: ['./message-embed.component.css']
})
export class MessageEmbedComponent {
  @Input() message;
  @Output() close = new EventEmitter<string>();
  @Input() canManage;
}
