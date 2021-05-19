import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';
import { Lean } from '../../types/entity-types';
import { Partial } from '../../types/ws-types';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from '../ws.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ListKeyManager } from '@angular/cdk/a11y';

@Injectable({ providedIn: 'root' })
export class GuildService extends HTTPWrapper<Lean.Guild> {
  protected endpoint = environment.endpoint + '/guilds';
  
  protected arr: Lean.Guild[] = [];
  public get guilds() {
    return this.arr;
  }
  
  constructor(
    http: HttpClient,
    ws: WSService,
    private userService: UserService,
  ) { super(http, ws); }

  public getGuildFromChannel(channelId: string): Lean.Guild | undefined {
    return this.guilds
      ?.find(g => g.channels
        .find(c => c.id === channelId));
  }

  public getSelfMember(guildId: string): Lean.GuildMember {
    return this.getMember(guildId, this.userService.self.id);
  }

  public getMember(guildId: string, userId: string): Lean.GuildMember {
    const guild = this.getCached(guildId);
    return guild?.members.find(m => m.userId === userId);
  }
  public getMemberInGuild(guildId: string, memberId: string): Lean.GuildMember {
    const guild = this.getCached(guildId);
    return guild?.members.find(m => m.id === memberId);
  }

  public getRole(guildId: string | undefined, roleId: string | undefined) {
    const guild = this.getCached(guildId);
    return guild?.roles.find(r => r.id === roleId);
  }

  public async ownsGuild(guildId: string, userId: string) {
    const guild = this.getCached(guildId);
    return guild.ownerId === userId;
  }

  public getInvites(guildId: string): Promise<Lean.Invite[]> {
    return this.http.get(`${this.endpoint}/${guildId}/invites`, this.headers).toPromise() as any;
  }

  public addBot(guildId: string, botId: string): Promise<any> {
    return this.http
      .get(`${this.endpoint}/${guildId}/authorize/user?clientid=${botId}`, this.headers)
      .toPromise() as any;
  }

  public async leave(guildId: string) {
    const guild = this.getCached(guildId);
    const confirmation = confirm(`Leave ${guild.name}?`);
    if (!confirmation) return;

    await this.kick(guildId, this.userService.self.id);
  }

  public async kick(guildId: string, userId: string) {
    const member = this.getMember(guildId, userId);
    await this.ws.emitAsync('GUILD_MEMBER_REMOVE', {
      guildId,
      memberId: member.id,
    }, this);
  }

  public deleteGuild(guildId: string) {
    return this.ws.emitAsync('GUILD_DELETE', { guildId }, this);
  }

  public patch(guildId: string, partialGuild: Partial.Guild) {
    return this.ws.emitAsync('GUILD_UPDATE', { guildId, partialGuild }, this);
  }

  public reorder<T extends keyof Lean.Guild>(guild: Lean.Guild, key: T, event: CdkDragDrop<Lean.Guild[T]>) {
    const prev = event.previousIndex;
    const curr = event.currentIndex;
    if (!prev || !curr || prev === curr) return;
    
    const arr = guild[key] as any[];
    moveItemInArray(arr, prev, curr);

    return this.ws.emitAsync('GUILD_UPDATE', {
      guildId: guild.id,
      partialGuild: {
        [key]: arr.map(r => r.id) as any
      },
    }, this);
  }
}
