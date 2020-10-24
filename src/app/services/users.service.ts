import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  endpoint = `${environment.endpoint}/users`;
  
  user: any;

  get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}
  
  async init() {
    if (!this.user)
      await this.updateUser();
  }

  async updateUser() {
    this.user = (this.key) ?
      await this.http.get(this.endpoint, { headers: { Authorization: this.key }}).toPromise() : null;
  }

  get(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}`, { headers: { Authorization: this.key } }).toPromise();
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