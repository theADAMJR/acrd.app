import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';

@Injectable({ providedIn: 'root' })
export class GuildService {
  readonly endpoint = environment.endpoint + '/guilds';
  private _guilds = [];
  
  get guilds() { return this._guilds; }
  private get headers() { return { headers: { Authorization: this.key } }; }

  private get key() {
    return localStorage.getItem('key');
  }
  
  constructor(
    private http: HttpClient,
    private usersService: UsersService) {}
  
  async init() {
    if (this.guilds.length <= 0)
      await this.updateGuilds();
  }

  async updateGuilds() {
    this._guilds = (this.key) ? 
      await this.http.get(this.endpoint, { headers: { Authorization: this.key }}).toPromise() as any : [];
  }

  getGuild(id: string) {
    return this.guilds?.find(g => g._id === id);
  }

  getSelfMember(guildId: string) {
    return this.getMember(guildId, this.usersService.user._id);
  }

  getMember(guildId: string, userId: string) {
    return this
      .getGuild(guildId)?.members
      .find(m => m.user._id === userId);
  }

  ownsGuild(guildId: string, userId: string) {
    return this.getGuild(guildId)?.owner._id === userId;
  }
  
  getSavedLog(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/${id}/log`).toPromise();
  }

  async createGuild(data: any): Promise<any> {
    return this.http.post(this.endpoint, data, this.headers).toPromise();
  }
  async createChannel(guildId: string, data: any): Promise<any> {
    return this.http.post(`${this.endpoint}/${guildId}`, data, this.headers).toPromise();
  }

  saveGuild(id: string, value: any): Promise<any> {    
    return this.http.patch(`${this.endpoint}/${id}`, value, this.headers).toPromise();
  }

  deleteGuild(id: any): Promise<any> {
    return this.http.delete(`${this.endpoint}/${id}`, this.headers).toPromise();
  }

  addBot(guildId: string, botId: any): Promise<any> {
    return this.http.get(`${this.endpoint}/${guildId}/authorize/user?client_id=${botId}`, this.headers).toPromise();
  }

  removeBot(guildId: string, botId: any) {
    alert('kick bot from guild');
  }
}
