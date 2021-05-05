import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogService } from 'src/app/services/log.service';
import { UserService } from 'src/app/services/user.service';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'app-create-guild',
  templateUrl: './create-guild.component.html',
  styleUrls: ['./create-guild.component.css']
})
export class CreateGuildComponent {
  @ViewChild('inviteInput')
  public inviteInput: ElementRef;

  public form = new FormGroup({
    name: new FormControl(`${this.userService.self.username}'s Guild`, [
      Validators.required,
      Validators.maxLength(32)
    ]),
  });

  constructor(
    public dialogRef: MatDialogRef<CreateGuildComponent>,
    private log: LogService,
    private userService: UserService,
    private ws: WSService,
  ) {}

  public async create() {
    if (this.form.invalid) return;

    this.dialogRef.close();

    this.ws.emit('GUILD_CREATE', {
      partialGuild: {
        name: this.form.value.name,
      },
    }, this);
  }

  public async joinGuild() {
    this.dialogRef.close();

    await this.ws.emitAsync('GUILD_MEMBER_ADD', {
      inviteCode: this.inviteInput.nativeElement.value,
    }, this);
    await this.log.success();
  }
}
