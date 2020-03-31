import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

// TODO: separate into classes - class has more than one responsibility
@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  endpoint = environment.endpoint;

  private _user: any;
  get user() { return this._user; }
  
  private _savedUser: any;
  get savedUser() { return this._savedUser; }
  
  private _guilds: any;
  get guilds() { return this._guilds; }

  private _publicGuilds: any;
  get publicGuilds() { return this._publicGuilds; }

  private get key() {
    return localStorage.getItem('key');
  }

  get xpCardPreviewURL() {
    return `${this.endpoint}/user/xp-card-preview?key=${this.key}`;
  }

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.updateUser();
  }

  async updateUser() {
    this._user = (this.key) ?
      await this.http.get(`${this.endpoint}/user?key=${this.key}`).toPromise() : null;
  }

  async updateSavedUser() {
    this._savedUser = (this.key) ? 
      await this.http.get(`${this.endpoint}/user?key=${this.key}`).toPromise() : null;
  }

  async updateGuilds() {
    this._guilds = (this.key) ? 
      await this.http.get(`${this.endpoint}/guilds?key=${this.key}`).toPromise() : null;
  }

  authenticate(code: string) {
    return this.http.get(`${this.endpoint}/auth?code=${code}`).toPromise() as Promise<string>;
  }

  getGuild(id: string) {
    return this.guilds?.find(g => g.id === id);
  }

  getPublicGuild(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/guilds/${id}/public`).toPromise();
  }

  getMembers(guildId: string) {
    return this.http.get(`${this.endpoint}/guilds/${guildId}/members`).toPromise() as Promise<any[]>;
  }

  getSavedGuild(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/guilds/${id}/config?key=${this.key}`).toPromise();
  }

  getXPCardPreviewURL(xpCard: XPCard) {
    const { primary, secondary, tertiary, backgroundURL } = xpCard;
    return `${this.endpoint}/user/xp-card-preview?key=${this.key}` +
      `&primary=${primary}` +
      `&secondary=${secondary}` +
      `&tertiary=${tertiary}` +
      `&backgroundURL=${backgroundURL}`;
  }
}

export interface XPCard {
  primary: string;
  secondary: string;
  tertiary: string;
  backgroundURL: string;
}