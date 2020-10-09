import { Component, Input, OnInit } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'invite-modal',
  templateUrl: './invite-modal.component.html',
  styleUrls: ['./invite-modal.component.css']
})
export class InviteModalComponent {
  @Input() guild;

  invite: any;

  constructor(
    private usersService: UsersService,
    private ws: WSService) {}

  open() {
    this.ws.socket.emit('INVITE_CREATE', { guild: this.guild, user: this.usersService.user });
    this.ws.socket.on('INVITE_CREATE', ({ invite }) => this.invite = invite);

    document.querySelector('.modal-backdrop')?.remove();
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.invite?._id);
  }
}
