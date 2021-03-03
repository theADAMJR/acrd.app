import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WSService } from 'src/app/services/ws.service';

@Component({
  selector: 'create-channel-modal',
  templateUrl: './create-channel-modal.component.html',
  styleUrls: ['./create-channel-modal.component.css']
})
export class CreateChannelModalComponent implements OnInit {
  @Input() guild;

  processing = false;

  form = new FormGroup({
    name: new FormControl('', [ Validators.required ]),
    type: new FormControl('TEXT')
  });

  constructor(
    private ws: WSService
  ) {}

  public ngOnInit() {
    const typeInput = this.form.get('type');
    typeInput.valueChanges
      .subscribe((value) => this.form
      .get('name')
      .setValidators([
        Validators.required,
        Validators.pattern((value === 'TEXT') ? /^[A-Za-z\-\d]+$/ : /.*/),
        Validators.maxLength(32)
      ]));

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
  }
}
