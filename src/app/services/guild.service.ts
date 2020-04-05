import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  endpoint = environment.endpoint + '/guilds';

  private _guilds: any;
  get guilds() { return this._guilds; }

  private _publicGuilds: any;
  get publicGuilds() { return this._publicGuilds; }

  private get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}  

  async updateGuilds() {
    this._guilds = (this.key) ? 
      await this.http.get(`${this.endpoint}?key=${this.key}`).toPromise() : null;
  }

  getGuild(id: string) {
    return this.guilds?.find(g => g.id === id);
  }

  getPublicGuild(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/public`).toPromise();
  }

  getMembers(guildId: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${guildId}/members`).toPromise() as Promise<any[]>;
  }

  getSavedGuild(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/config?key=${this.key}`).toPromise();
  }

  saveGuild(id: string, module: string, value: any): Promise<any> {    
    return this.http.put(`${this.endpoint}/${id}/${module}?key=${this.key}`, value).toPromise();
  }

  async getChannels(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/channels`).toPromise();
  }

  async getRoles(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/roles`).toPromise();
  }
}
