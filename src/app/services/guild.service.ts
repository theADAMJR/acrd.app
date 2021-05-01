import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UsersService } from './users.service';
import { Lean } from '../types/entity-types';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from './ws.service';
import { ActivatedRoute } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class GuildService extends HTTPWrapper<Lean.Guild> {
  protected endpoint = environment.endpoint + '/guilds';
  
  protected _arr: Lean.Guild[] = [];
  public get guilds() {
    return this._arr;
  }
  
  constructor(
    http: HttpClient,
    ws: WSService,
    private route: ActivatedRoute,
    private usersService: UsersService,
  ) { super(http, ws); }

  public getGuildFromChannel(channelId: string): Lean.Guild | undefined {
    return this.guilds
      ?.find(g => g.channels
        .find(c => c._id === channelId));
  }

  public getSelfMember(guildId: string): Lean.GuildMember {
    return this.getMember(guildId, this.usersService.self._id);
  }

  public getMemberById(memberId: string): Lean.GuildMember {
    return this.guilds
      .flatMap(g => g.members)
      .find(m => m._id === memberId);
  }
  public getMember(guildId: string, userId: string): Lean.GuildMember {
    const guild = this.getCached(guildId);
    return guild?.members.find(m => m.userId === userId);
  }

  public async ownsGuild(guildId: string, userId: string) {
    const guild = await this.getAsync(guildId);
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
    const member = this.getMember(guildId, this.usersService.self._id);
    await this.kick(guildId, member._id);
  }

  public async kick(guildId: string, memberId: string) {
    await this.ws.emitAsync('GUILD_MEMBER_REMOVE', { memberId, guildId }, this);
  }
}
