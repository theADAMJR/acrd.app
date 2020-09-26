import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  endpoint = environment.endpoint + '/guilds';

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
      await this.http.get(`${this.endpoint}`, { headers: { Authorization: this.key }}).toPromise() as any : [];
  }

  getGuild(id: string) {
    return this.guilds?.find(g => g._id === id);
  }
  
  getSavedLog(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/log`).toPromise();
  }

  saveGuild(id: string, module: string, value: any): Promise<any> {    
    return this.http.put(`${this.endpoint}/${id}/${module}`, value).toPromise();
  }

  async createGuild(data: any): Promise<any> {
    return this.http.post(this.endpoint, data, { headers: { Authorization: this.key } }).toPromise();
  }

  getMessages(guildId: string, channelId: string): Promise<any> {
    return this.http.get(`${environment.endpoint}/channels/${guildId}/${channelId}`,
      { headers: { Authorization: this.key } }).toPromise();
  }
}
