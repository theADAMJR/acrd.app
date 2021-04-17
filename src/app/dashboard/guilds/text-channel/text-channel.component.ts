import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Lean } from 'src/app/types/entity-types';
import { TextBasedChannel } from '../../text-based-channel';

@Component({
  selector: 'app-text-channel',
  templateUrl: './text-channel.component.html',
  styleUrls: ['./text-channel.component.css']
})
export class TextChannelComponent extends TextBasedChannel implements OnInit {
  @ViewChild('notificationSound') notificationSound: ElementRef;

  public get guild() {
    return this.guildService.getGuild(this.parentId);
  }

  public async ngOnInit() {
    await super.init();
  }

  // emoji picker
  public addEmoji({ emoji }) {
    console.log(emoji.native);
    (document.querySelector('#chatBox') as HTMLInputElement).value += emoji.native;
  }

  public onClick({ path }) {
    const emojiPickerWasClicked = path
      .some(n => n && n.nodeName === 'EMOJI-MART' || n.classList?.contains('emoji-icon'));
    this.emojiPickerOpen = emojiPickerWasClicked;
  }

  // manage users
  // FIXME: move this somewhere else
  public kickMember(user: Lean.User) {
    console.log(user);
  }
}
