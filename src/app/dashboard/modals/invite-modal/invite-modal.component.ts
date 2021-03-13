import { Component, Input } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css']
})
export class InviteModalComponent {
  @Input() guild;

  invite: Lean.Invite;

  constructor(
    private log: LogService,
    private usersService: UsersService,
    private ws: WSService) {}

  public open() { 
    this.ws.emit('INVITE_CREATE', {
      guildId: this.guild._id,
      userId: this.usersService.user._id,
      options: {} // TODO: add invite options
    });

    document.querySelector('.modal-backdrop')?.remove();

    this.hookWSEvents();
  }

  public hookWSEvents() {
    this.ws.on('INVITE_CREATE', ({ invite }) => {
      this.invite = invite;
    }, this);
  }

  public copyToClipboard() {
    navigator.clipboard.writeText(this.invite?._id);
  }
}
