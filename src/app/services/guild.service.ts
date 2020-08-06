import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  endpoint = environment.endpoint + '/guilds';
  
  singleton = null;

  private _guilds = [];
  get guilds() { return this._guilds; }

  private get key() {
    return localStorage.getItem('key');
  }
  
  constructor(private http: HttpClient) {} 
  
  async init() {
    if (this.guilds.length <= 0)
      await this.updateGuilds();
  }

  async updateGuilds() {
    this._guilds = (this.key) ? 
      await this.http.get(`${this.endpoint}?key=${this.key}`).toPromise() as any : [];
  }

  getGuild(id: string) {
    return this.guilds?.find(g => g.id === id);
  }

  getPublicGuild(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/public`).toPromise();
  }

  getMembers(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/members`).toPromise();
  }

  getSavedGuild(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/config?key=${this.key}`).toPromise();
  }

  getSavedLog(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/log?key=${this.key}`).toPromise();
  }

  saveGuild(id: string, module: string, value: any): Promise<any> {    
    return this.http.put(`${this.endpoint}/${id}/${module}?key=${this.key}`, value).toPromise();
  }

  getChannels(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/channels`).toPromise();
  }

  getRoles(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/roles`).toPromise();
  }

  getBotStatus(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/bot-status`).toPromise();
  }

  getMessage(id: string, channelId: string, messageId: string): Promise<any> {    
    return this.http.get(`${this.endpoint}/${id}/channels/${channelId}/messages/${messageId}`).toPromise();
  }
}
