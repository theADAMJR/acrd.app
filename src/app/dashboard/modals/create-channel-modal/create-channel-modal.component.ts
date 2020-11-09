import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { UsersService } from 'src/app/services/users.service';
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
    name: new FormControl('', [
      Validators.required,
      Validators.pattern(/[A-Za-z\-\d]/),
      Validators.maxLength(32)
    ]),
    type: new FormControl('TEXT')
  });

  constructor(
    private guildService: GuildService,
    private router: Router,
    private ws: WSService) {}

  ngOnInit() {
    this.form
      .get('type').valueChanges
      .subscribe((value) => this.form.get('name').setValidators([
        Validators.required,
        Validators.pattern(value === 'TEXT' ? /[A-Za-z\-\d]/ : /.*/),
        Validators.maxLength(32)       
      ]));
  }

  open() {
    document
      .querySelector('.modal-backdrop')
      ?.remove();
  }

  async submit() {
    if (this.form.invalid) return;

    this.processing = true;

    const channel = await this.guildService.createChannel(this.guild._id, this.form.value);
    
    document.querySelector('.modal-backdrop')?.remove();

    this.router.navigate([`/channels/${this.guild._id}/${channel._id}`]);
  }

  create() {
    this.processing = true;
    this.ws.socket.emit('GUILD_MEMBER_ADD', { guild: this.guild, ...this.form.value });
  }
}
