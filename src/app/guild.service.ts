import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  private get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}

  async getChannels(id: string) {
    return [{
      id: '123',
      name: 'general',
      type: 'text'
    }];
  }

  async getRoles(id: string) {
    return [
    {
      name: 'Admin',
      color: '0F0F0F'
    },
    {
      name: 'Member',
      color: '000000'
    }];
  }
}
