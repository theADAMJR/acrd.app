import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GuildService } from 'src/app/services/guild.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'create-guild-modal',
  templateUrl: './create-guild-modal.component.html',
  styleUrls: ['./create-guild-modal.component.css']
})
export class CreateGuildModalComponent {
  form = new FormGroup({
    name: new FormControl(`${this.userService.user.username}'s Guild`, [
      Validators.required,
      Validators.maxLength(32)
    ]),
  });

  constructor(
    private guildService: GuildService,
    private router: Router,
    private userService: UsersService) {}

  async submit() {
    if (this.form.invalid) return;

    const { _id } = await this.guildService.createGuild(this.form.value);
    await this.guildService.updateGuilds();
    
    document.querySelector('.modal-backdrop')?.remove();

    this.router.navigate([`/channels/${_id}`]);
  }
}
