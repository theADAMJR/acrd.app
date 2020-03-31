import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { XPCard } from 'api/models/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  endpoint = environment.endpoint;
  
  private get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}

  updateXPCard(xpCard: XPCard) {
    return this.http.put(`${this.endpoint}/user/xp-card?key=${this.key}`, xpCard).toPromise();
  }
}
