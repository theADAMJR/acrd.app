import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
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
    name: new FormControl(''),
    type: new FormControl('TEXT')
  });

  constructor(
    private guildService: GuildService,
    private router: Router,
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

    const channel = await this.guildService.createChannel(this.guild._id, this.form.value);
    
    document.querySelector('.modal-backdrop')?.remove();

    this.router.navigate([`/channels/${this.guild._id}/${channel._id}`]);
  }
}
