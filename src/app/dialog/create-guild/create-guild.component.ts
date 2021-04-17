import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { UsersService } from 'src/app/services/users.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean } from 'src/app/types/entity-types';

@Component({
  selector: 'app-create-guild',
  templateUrl: './create-guild.component.html',
  styleUrls: ['./create-guild.component.css']
})
export class CreateGuildComponent {
  @ViewChild('inviteInput')
  public inviteInput: ElementRef;

  public processing = false;

  public form = new FormGroup({
    name: new FormControl(`${this.userService.user.username}'s Guild`, [
      Validators.required,
      Validators.maxLength(32)
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateGuildComponent>,
    private userService: UsersService,
    private ws: WSService,
  ) {}

  public async create() {
    if (this.form.invalid) return;

    this.processing = true;

    this.ws.emit('GUILD_CREATE', {
      partialGuild: {
        name: this.form.value.name,
      },
    }, this);

    this.dialogRef.close();
  }

  public joinGuild() {
    this.processing = true;
    this.ws.emit('GUILD_MEMBER_ADD', {
      inviteCode: this.inviteInput.nativeElement.value,
    }, this);

    this.dialogRef.close();
  }
}
