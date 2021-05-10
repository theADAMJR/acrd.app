import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-create-invite',
  templateUrl: './create-invite.component.html',
  styleUrls: ['./create-invite.component.css']
})
export class CreateInviteComponent implements OnInit {
  public invite: Lean.Invite;
  public recentlyUpdated = false;

  public form = new FormGroup({
    maxUses: new FormControl('', [ Validators.required, Validators.min(1), Validators.max(1000) ]),
    expiresAt: new FormControl('', [ Validators.required ]),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateInviteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      guild: Lean.Guild,
    },
    private ws: WSService,
  ) {}

  public ngOnInit() {
    this.ws.emit('INVITE_CREATE', {
      guildId: this.data.guild.id,
      options: this.form.value,
    }, this);

    this.ws.on('INVITE_CREATE', ({ invite }) => this.invite = invite, this);

    this.form.valueChanges
      .subscribe(() => this.recentlyUpdated = this.form.valid);
  }

  public onNoClick() {
    this.dialogRef.close();
  }

  public updateInvite() {
    if (this.form.invalid) return;

    this.recentlyUpdated = true;

    this.ws.emit('INVITE_DELETE', { inviteCode: this.invite.id }, this);
    this.ws.emit('INVITE_CREATE', {
      guildId: this.data.guild.id,
      options: this.form.value,
    }, this);    
  }

  public copyToClipboard() {
    navigator.clipboard.writeText(this.invite?.id);
  }
}
