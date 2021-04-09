import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  public getDiscordUser(id: string): Promise<PartialDiscordUser> {
    return this.http
      .get(`${this.endpoint}/discord-user/${id}`)
      .toPromise() as any;
  }
}

export interface PartialDiscordUser {
  avatar: string;
  username: string;
}