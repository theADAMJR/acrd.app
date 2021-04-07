import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';
import { Lean } from '../types/entity-types';
import { Partial } from '../types/ws-types';

@Injectable({ providedIn: 'root' })
export class GuildService {
  private readonly endpoint = environment.endpoint + '/guilds';
  private _guilds: Lean.Guild[] = [];
  
  public get guilds() { return this._guilds; }
  private get headers() { return { headers: { Authorization: `Bearer ${localStorage.getItem('key')}` } }; }

  private get key() {
    return localStorage.getItem('key');
  }
  
  constructor(
    private http: HttpClient,
    private usersService: UsersService) {}
  
  public async init() {
    if (this.guilds.length <= 0)
      await this.updateGuilds();
  }

  public async updateGuilds() {    
    this._guilds = (this.key)
      ? await this.http.get(this.endpoint, this.headers).toPromise() as any
      : [];    
  }

  public getGuild(id: string): Lean.Guild {
    return this.guilds?.find(g => g._id === id);
  }

  public updateCached(id: string, value: Lean.Guild): Lean.Guild {
    const index = this.guilds.findIndex(g => g._id === id);
    return this.guilds[index] = value;
  }

  public getSelfMember(guildId: string): Lean.GuildMember {
    return this.getMember(guildId, this.usersService.user._id);
  }

  public getMember(guildId: string, userId: string): Lean.GuildMember {
    return this
      .getGuild(guildId)?.members
      .find(m => m.userId === userId);
  }

  public ownsGuild(guildId: string, userId: string) {
    return this.getGuild(guildId)?.ownerId === userId;
  }

  public getInvites(guildId: string): Promise<Lean.Invite[]> {
    return this.http.get(`${this.endpoint}/${guildId}/invites`, this.headers).toPromise() as any;
  }

  public addBot(guildId: string, botId: string): Promise<any> {
    return this.http
      .get(`${this.endpoint}/${guildId}/authorize/user?client_id=${botId}`, this.headers)
      .toPromise() as any;
  }

  public removeBot(guildId: string, botId: string) {
    alert('kick bot from guild');
  }
}
