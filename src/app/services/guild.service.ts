import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GuildService {
  endpoint = environment.endpoint + '/guilds';
  
  singleton = null;

  get guilds() { return JSON.parse(localStorage.getItem('guilds')); }
  get publicGuilds() { return JSON.parse(localStorage.getItem('publicGuilds')); }

  private get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}  

  async updateGuilds() {
    const guilds = (this.key) ? 
      await this.http.get(`${this.endpoint}?key=${this.key}`).toPromise() as any : [];
    localStorage.setItem('guilds', JSON.stringify(guilds));
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
}
