import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {
  user: User;
  endpoint = environment.api;

  get loggedIn() { return new JwtHelperService().isTokenExpired(this.token); }
  get token() { return localStorage.getItem('token'); }

  constructor(private http: HttpClient, private router: Router) {
    this.getCurrentUser().then(user => this.user = user); }

  async signUp(user: Credentials) {
    const res: any = await this.http.post(`${this.endpoint}/sign-up`, user).toPromise();

    if (res) {
      localStorage.setItem('token', res);
      await this.updateUser();
    }
    return Boolean(res);
  }

  async login(user: Credentials) {
    const res: any = await this.http.post(`${this.endpoint}/login`, user).toPromise();

    if (res) {
      localStorage.setItem('token', res);
      await this.updateUser();
    }
    return Boolean(res);
  }

  logout() {
    localStorage.removeItem('token');
    this.user = null;
  }

  async updateUser() {
    this.user = await this.getCurrentUser();
  }

  async getUser(id: string) {
    return this.http.get(`${this.endpoint}/users/${id}`).toPromise() as Promise<User>;
  }

  private async getCurrentUser() {
    const id = (this.token) ? new JwtHelperService().decodeToken(this.token)._id : null;
    try {
      return await this.getUser(id);
    } catch { return null; }
  }
}

export interface User {
  _id: string;
  username: string;
  bio: string;
  following: string[];
  followers: string[];
  tags: string[];
  createdAt: Date;
}

export interface Credentials {
  username: string;
  password: string;
}
