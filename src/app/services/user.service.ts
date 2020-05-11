import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = environment.endpoint + '/user';

  get user() { return JSON.parse(localStorage.getItem('user')); }  
  get savedUser() { return JSON.parse(localStorage.getItem('savedUser')); }

  get xpCardPreviewURL() {
    return `${this.endpoint}/xp-card-preview?key=${this.key}`;
  }

  constructor(private http: HttpClient) {}
  
  private get key() {
    return localStorage.getItem('key');
  }

  async updateUser() {
    const user = (this.key) ?
      await this.http.get(`${this.endpoint}?key=${this.key}`).toPromise() : null
    localStorage.setItem('user', JSON.stringify(user));
  }

  async updateSavedUser() {
    const savedUser = (this.key) ? 
      await this.http.get(`${this.endpoint}/saved?key=${this.key}`).toPromise() : null;
    localStorage.setItem('savedUser', JSON.stringify(savedUser));
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
