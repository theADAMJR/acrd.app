import { Injectable, Type } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';
import { Partial } from '../types/ws-types';
import { Lean } from '../types/entity-types';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from './ws.service';
import { LogService } from './log.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuildService extends HTTPWrapper<Lean.Guild> {
  protected endpoint = environment.endpoint + '/guilds';
  public self: Lean.Guild;
  
  protected _arr: Lean.Guild[] = [];
  public get guilds() {
    return this._arr;
  }
  
  constructor(
    http: HttpClient,
    ws: WSService,
    private route: ActivatedRoute,
    private usersService: UsersService,
    private log: LogService,
  ) { super(http, ws); }
  
  public async init() {
    await super.init();
    
    this.route.paramMap.subscribe(async (paramMap) => {
      const guildId = paramMap.get('guildId');
      this.self = await this.get(guildId);
    });
  }

  public getGuildFromChannel(channelId: string): Lean.Guild | undefined {
    return this.guilds
      ?.find(g => g.channels
        .find(c => c._id === channelId));
  }

  public getSelfMember(guildId: string): Promise<Lean.GuildMember> {
    return this.getMember(guildId, this.usersService.self._id);
  }

  public async getMemberById(guildId: string, memberId: string): Promise<Lean.GuildMember> {
    const guild = await this.get(guildId);
    return guild?.members
      .find(m => m._id === memberId);
  }
  public async getMember(guildId: string, userId: string): Promise<Lean.GuildMember> {
    const guild = await this.get(guildId);
    return guild?.members
      .find(m => m.userId === userId);
  }

  public async ownsGuild(guildId: string, userId: string) {
    const guild = await this.get(guildId);
    return guild.ownerId === userId;
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
    const member = await this.getMember(guildId, this.usersService.self._id);
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
