import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { WSService } from 'src/app/services/ws.service';
import { Lean, patterns } from 'src/app/types/entity-types';

@Component({
  selector: 'create-channel-modal',
  templateUrl: './create-channel-modal.component.html',
  styleUrls: ['./create-channel-modal.component.css']
})
export class CreateChannelModalComponent implements OnInit {
  @Input() guild: Lean.Guild;

  processing = false;

  form = new FormGroup({
    name: new FormControl('chat', [ Validators.required ]),
    type: new FormControl('TEXT'),
  });

  constructor(
    private router: Router,
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

  public open() {
    document
      .querySelector('.modal-backdrop')
      ?.remove();
  }

  public async create() {
    if (this.form.invalid) return;

    this.processing = true;
    
    document.querySelector('.modal-backdrop')?.remove();

    this.ws.emit('CHANNEL_CREATE', {
      partialChannel: this.form.value,
      guildId: this.guild._id
    });

    this.ws.on('CHANNEL_CREATE', async ({ channel }) => {
      await this.router.navigate([`/channels/${channel.guildId}/${channel._id}`]);
      this.processing = false;
    }, this);
  }
}
