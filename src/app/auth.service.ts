import { Injectable } from '@angular/core';
import * as config from '../../config.json';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  static inviteLink = `https://discordapp.com/api/oauth2/authorize?client_id=${config.bot.id}&permissions=8&scope=bot`;

  constructor() { }
}
