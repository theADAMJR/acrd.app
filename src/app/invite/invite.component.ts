import { Component } from '@angular/core';
import config from 'config.json';

@Component({
  selector: 'app-invite',
  templateUrl: './invite.component.html',
  styleUrls: ['./invite.component.css']
})
export class InviteComponent {
  url = `https://discordapp.com/api/oauth2/authorize?client_id=${config.bot.id}&redirect_uri=${config.url}/dashboard&permissions=8&scope=bot`;

  constructor() {
    window.location.assign(this.url);
  }
}
