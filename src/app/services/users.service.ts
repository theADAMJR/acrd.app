import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { UserAuthService } from './user-auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  endpoint = `${environment.endpoint}/users`;

  constructor(
    private http: HttpClient,
    private auth: UserAuthService) {}

  getAll(): Promise<any> {
    return this.http.get(`${this.endpoint}`).toPromise();
  }

  update(id: string, newItem: any, extraOptions?: any) {
    return this.http.put(id, newItem,
      { ...extraOptions, headers: this.buildHeaders() }).toPromise();
  }

  follow(id: string) {
    return this.http.get(`${this.endpoint}/${id}/add-friend`,
      { headers: this.buildHeaders() }).toPromise();
  }

  unfollow(id: string) {
    return this.http.get(`${this.endpoint}/${id}/remove-friend`,
      { headers: this.buildHeaders() }).toPromise();
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

  private buildHeaders() {
    return new HttpHeaders({ Authorization: `${this.auth.token}` });
  }
}
