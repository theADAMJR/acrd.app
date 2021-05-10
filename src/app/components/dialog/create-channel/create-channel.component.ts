import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/api/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean, patterns } from 'src/app/types/entity-types';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.css']
})
export class CreateChannelComponent {
  // TODO: use different form for voice channel
  public form = new FormGroup({
    name: new FormControl('chat', [
      Validators.pattern(patterns.textChannelName),
      Validators.required,
    ]),
    type: new FormControl('TEXT'),
  });

  public processing = false;

  constructor(
    public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      guild: Lean.Guild,
    },
    private ws: WSService,
  ) {}

  public async create() {
    if (this.form.invalid) return;

    this.dialogRef.close();

    await this.ws.emitAsync('CHANNEL_CREATE', {
      partialChannel: this.form.value,
      guildId: this.data.guild.id
    }, this);
  }
}
