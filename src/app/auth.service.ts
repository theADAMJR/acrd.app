import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnInit {
  endpoint = environment.endpoint;

  private _user: any;
  get user() { return this._user; }
  
  private _guilds: any;
  get guilds() { return this._guilds; }

  constructor(private http: HttpClient) {}

  async ngOnInit() {
    await this.updateUser();
  }

  async updateUser() {
    const key = localStorage.getItem('key');
    this._user = (key) ? 
      await this.http.get(`${this.endpoint}/user?key=${key}`).toPromise() : null;
  }

  async updateGuilds() {
    const key = localStorage.getItem('key');
    this._guilds = (key) ? 
      await this.http.get(`${this.endpoint}/guilds?key=${key}`).toPromise() : null;      
  }

  async authenticate(code: string) {
    return this.http.get(`${this.endpoint}/auth?code=${code}`).toPromise() as Promise<string>;
  }
}
