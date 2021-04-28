import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';
import { Partial } from '../types/ws-types';
import { Lean } from '../types/entity-types';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from './ws.service';
import { LogService } from './log.service';

@Injectable({ providedIn: 'root' })
export class GuildService extends HTTPWrapper {
  private readonly endpoint = environment.endpoint + '/guilds';
  private _guilds: Lean.Guild[] = [];
  
  public get guilds() {
    return this._guilds;
  }
  
  constructor(
    http: HttpClient,
    private usersService: UsersService,
    private log: LogService,
    ws: WSService,
  ) { super(http, ws); }
  
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

  public getGuildFromChannel(channelId: string): Lean.Guild | undefined {
    return this.guilds
      ?.find(g => g.channels
        .find(c => c._id === channelId));
  }

  public updateCached(id: string, value: Lean.Guild): Lean.Guild {
    const index = this.guilds.findIndex(g => g._id === id);
    return this.guilds[index] = value;
  }

  public getSelfMember(guildId: string): Lean.GuildMember {
    return this.getMember(guildId, this.usersService.user._id);
  }

  public getMemberById(guildId: string, memberId: string): Lean.GuildMember {
    return this
      .getGuild(guildId)?.members
      .find(m => m._id === memberId);
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

  public async leave(guildId: string) {
    const member = this.getMember(guildId, this.usersService.user._id);
    await this.kick(guildId, member._id);
  }

  public async kick(guildId: string, memberId: string) {
    try {
      await this.ws.emitAsync('GUILD_MEMBER_REMOVE', { memberId, guildId }, this);
      await this.log.success();
    } catch (error) {
      await this.log.error(error.message);
    }
  }
}
