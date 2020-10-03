import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class UserAuthService {
  endpoint = environment.endpoint;

  get loggedIn() { return this.usersService.user && !(new JwtHelperService().isTokenExpired(this.key)); }
  get key() { return localStorage.getItem('key'); }

  constructor(
    private http: HttpClient,
    private usersService: UsersService) {}

  async signUp(user: Credentials) {
    const res: any = await this.http.post(`${this.endpoint}/users`, user).toPromise();

    if (res) {
      localStorage.setItem('key', res);
      await this.usersService.updateUser();
    }
    return Boolean(res);
  }

  async login(user: Credentials) {
    const res: any = await this.http.post(`${this.endpoint}/login`, user).toPromise();

    if (res) {
      localStorage.setItem('key', res);
      await this.usersService.updateUser();
    }
    return Boolean(res);
  }
}

export interface Credentials {
  username: string;
  password: string;
}