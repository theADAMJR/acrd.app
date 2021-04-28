import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { LogService } from 'src/app/services/log.service';
import { WSService } from 'src/app/services/ws.service';
import { Lean, patterns } from 'src/app/types/entity-types';

@Component({
  selector: 'app-create-channel',
  templateUrl: './create-channel.component.html',
  styleUrls: ['./create-channel.component.css']
})
export class CreateChannelComponent {
  public form = new FormGroup({
    name: new FormControl('chat', [ Validators.required ]),
    type: new FormControl('TEXT'),
  });

  public processing = false;

  constructor(
    public dialogRef: MatDialogRef<CreateChannelComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      guild: Lean.Guild,
    },
    private log: LogService,
    private ws: WSService,
  ) {}

  public ngOnInit() {
    const typeInput = this.form.get('type');
    typeInput.valueChanges
      .subscribe((value) => this.form
        .get('name')
        .setValidators([
          Validators.required,
          Validators.pattern((value === 'TEXT') ? patterns.textChannelName : /.*/),
          Validators.maxLength(32)
        ]
      ));

    const nameInput = this.form.get('name');
    nameInput.valueChanges
      .subscribe((value: string) => {
        if (typeInput.value !== 'TEXT') return;
        
        if (value.includes(' '))
          nameInput.setValue(value.replace(/ /g, '-'));
      });
  }

  public async create() {
    if (this.form.invalid) return;

    try {
      this.ws.emitAsync('CHANNEL_CREATE', {
        partialChannel: this.form.value,
        guildId: this.data.guild._id
      }, this);
  
      await this.log.success();
      this.dialogRef.close();
    } catch (error) {
      await this.log.error(error.message);
    }
  }
}
