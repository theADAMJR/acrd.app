import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class UsersService {
  endpoint = `${environment.endpoint}/users`;
  knownUsers = [];
  user: any;

  private get headers() {
    return { headers: { Authorization: this.key } };
  }

  get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}
  
  public async init() {
    if (!this.user)
      await this.updateUser();
    if (this.knownUsers.length <= 0)
      await this.updateKnownUsers();
  }

  public getUnknown(userId: string) {
    return {
      username: `Unknown - ${userId}`,
      avatarURL: `${environment.endpoint}/assets/avatars/avatar-gray.png`
    }
  } 

  public async updateUser() {
    this.user = (this.key) ?
      await this.http.get(this.endpoint, this.headers).toPromise() : null;
  }
  public async updateKnownUsers() {
    this.knownUsers = (this.key)
      ? await this.http.get(`${this.endpoint}/known`, this.headers).toPromise() as any
      : [];
    this.knownUsers.push(this.user);
  }

  public get(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}`, this.headers).toPromise();
  }
  public getKnown(id: string) {    
    return this.knownUsers?.find(u => u._id === id);
  }

  public addKnownUser(user: any) {
    const userInArray = this.knownUsers.some(u => u._id === user._id);
    if (!userInArray)
      this.knownUsers.push(user);
  }

  public avatarURL(id: string) {
    return `${this.endpoint}/${id}/avatar`;
  }

  public uploadAvatar(avatar: File) {
    const headers = this.buildHeaders();
    return this.http
      .post(`${this.endpoint}/upload-avatar`, { avatar }, { headers })
      .toPromise();
  }

  public getUsernames(): Promise<any> {
    return this.http.get(`${this.endpoint}/usernames`).toPromise();
  }

  public getBots(): Promise<any> {
    return this.http.get(`${this.endpoint}/bots`).toPromise();
  }

  private buildHeaders() {
    return new HttpHeaders({ Authorization: `${this.key}` });
  }
}
