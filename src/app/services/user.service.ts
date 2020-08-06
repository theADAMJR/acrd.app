import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = environment.endpoint + '/user';

  private _user: any;
  get user() { return this._user; }

  private _savedUser: any;
  get savedUser() {
    return this._savedUser;
  }

  get xpCardPreviewURL() {
    return `${this.endpoint}/xp-card-preview?key=${this.key}`;
  }

  constructor(private http: HttpClient) {}
  
  private get key() {
    return localStorage.getItem('key');
  }

  async init() {
    if (!this.user || !this.savedUser)
      await this.updateUser();
  }

  async updateUser() {
    this._user = (this.key) ?
      await this.http.get(`${this.endpoint}?key=${this.key}`).toPromise() : null
    this._savedUser = (this.key) ? 
      await this.http.get(`${this.endpoint}/saved?key=${this.key}`).toPromise() : null;
  }

  updateXPCard(xpCard: XPCard) {
    return this.http.put(`${this.endpoint}/xp-card?key=${this.key}`, xpCard).toPromise();
  }

  getXPCardPreviewURL(xpCard: XPCard) {
    const { primary, secondary, tertiary, backgroundURL } = xpCard;
    return `${this.endpoint}/xp-card-preview?key=${this.key}` +
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
