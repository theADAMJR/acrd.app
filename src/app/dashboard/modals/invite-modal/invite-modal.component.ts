import { Component, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
  @Input()
  public guild: Lean.Guild;

  public invite: Lean.Invite;
  public recentlyUpdated = false;

  public form = new FormGroup({
    maxUses: new FormControl('', [ Validators.required, Validators.min(1), Validators.max(1000) ]),
    expiresAt: new FormControl('', [ Validators.required ]),
  });

  constructor(
    private ws: WSService,
  ) {}

  public open() {
    this.ws.emit('INVITE_CREATE', {
      guildId: this.guild._id,
      options: this.form.value,
    });

    this.ws.once('INVITE_CREATE', ({ invite }) => this.invite = invite, this);

    this.form.valueChanges
      .subscribe(() => this.recentlyUpdated = this.form.valid);

    document.querySelector('.modal-backdrop')?.remove();
  }

  public updateInvite() {
    if (this.form.invalid) return;

    this.recentlyUpdated = true;

    this.ws.emit('INVITE_DELETE', { inviteCode: this.invite._id });

    this.ws.emit('INVITE_CREATE', {
      guildId: this.guild._id,
      options: this.form.value,
    });    
  }

  public copyToClipboard() {
    navigator.clipboard.writeText(this.invite?._id);
  }
}
