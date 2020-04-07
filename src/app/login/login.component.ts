import { Component, OnInit } from '@angular/core';
import config from '../../../config.json';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  url = `https://discordapp.com/api/oauth2/authorize?client_id=${config.bot.id}&redirect_uri=${config.url}/auth&response_type=code&scope=identify%20guilds`;

  ngOnInit() {
    window.location.assign(this.url);
  }
}
