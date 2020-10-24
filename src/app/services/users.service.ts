import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  endpoint = `${environment.endpoint}/users`;

  dmChannels = [];
  knownUsers = [];
  user: any;

  get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}
  
  async init() {
    if (!this.user)
      await this.updateUser();
    if (this.dmChannels.length <= 0)
      await this.updateDMChannels();
    if (this.knownUsers.length <= 0)
      await this.updateKnownUsers();
  }

  async updateUser() {
    this.user = (this.key) ?
      await this.http.get(this.endpoint, { headers: { Authorization: this.key } }).toPromise() : null;
  }
  async updateKnownUsers() {
    this.knownUsers = (this.key) ?
      await this.http.get(`${this.endpoint}/known`, { headers: { Authorization: this.key } }).toPromise() as any : null;
  }
  async updateDMChannels() {
    this.dmChannels = (this.key) ?
      await this.http.get(`${this.endpoint}/dm-channels`, { headers: { Authorization: this.key } }).toPromise() as any : null;
  }

  get(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}`, { headers: { Authorization: this.key } }).toPromise();
  }
  getKnown(id: string) {
    return this.knownUsers.find(u => u._id === id);
  }

  addKnownUser(user: any) {
    const userInArray = this.knownUsers.some(u => u._id === user._id);
    if (!userInArray)
      this.knownUsers.push(user);
  }

  getDMChannel(recipientId: string) {
    return this.dmChannels.find(c => c.recipientIds.includes(recipientId)
      && c.recipientIds.includes(this.user._id));
  }

  update(id: string, newItem: any, extraOptions?: any) {
    return this.http.put(id, newItem,
      { ...extraOptions, headers: this.buildHeaders() }).toPromise();
  }

  avatarURL(id: string) {
    return `${this.endpoint}/${id}/avatar`;
  }

  uploadAvatar(avatar: File) {
    const headers = this.buildHeaders();
    return this.http
      .post(`${this.endpoint}/upload-avatar`, { avatar }, { headers })
      .toPromise();
  }

  getUsernames(): Promise<any> {
    return this.http.get(`${this.endpoint}/usernames`).toPromise();
  }

  private buildHeaders() {
    return new HttpHeaders({ Authorization: `${this.key}` });
  }
}