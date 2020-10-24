import { Component, Input, OnInit } from '@angular/core';
import { LogService } from 'src/app/services/log.service';
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
    private log: LogService,
    private usersService: UsersService,
    private ws: WSService) {}

  open() {
    this.log.info('SEND INVITE_CREATE', 'invt');    
    this.ws.socket.emit('INVITE_CREATE', { guild: this.guild, user: this.usersService.user });

    document.querySelector('.modal-backdrop')?.remove();

    this.hookWSEvents();
  }

  hookWSEvents() {
    this.ws.socket.on('INVITE_CREATE', ({ invite }) => {
      this.log.info('GET INVITE_CREATE', 'invt'); 

      this.invite = invite;
    });
  }

  copyToClipboard() {
    navigator.clipboard.writeText(this.invite?._id);
  }
}
