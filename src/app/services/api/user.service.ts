import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean, UserTypes } from '../../types/entity-types';
import { Partial } from '../../types/ws-types';
import { array } from '../../utils/utils';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from '../ws.service';

@Injectable({ providedIn: 'root' })
export class UserService extends HTTPWrapper<Lean.User> {
  public self: UserTypes.Self;
  public endpoint = `${environment.endpoint}/users`;
  protected _arr: Lean.User[] = [];

  public get friends() {
    return this.self.friendIds.map(id => this.getCached(id));
  }
  public get friendRequests() {
    const isOutgoing = (u: Lean.User) => u.friendRequestIds.includes(this.self.id);    

    return this._arr
      .filter(isOutgoing)
      .concat(this.self.friendRequestIds
        .map(id => this.getCached(id))
      )
      .filter(array.distinctBy('id'));
  }

  constructor(
    http: HttpClient,
    ws: WSService,
  ) {
    super(http, ws);
  }
  
  public avatarURL(id: string) {
    return `${this.endpoint}/${id}/avatar`;
  }

  public getBots(): Promise<Lean.User[]> {
    return this.http
      .get(`${this.endpoint}/bots`)
      .toPromise() as any;
  }

  public async fetchSelf(): Promise<UserTypes.Self> {
    return this.self = await this.http
      .get(`${this.endpoint}/self`, this.headers)
      .toPromise() as any;
  }

  public async checkUsername(username: string): Promise<boolean> {
    return this.http
      .get(`${this.endpoint}/check-username?value=${username}`)
      .toPromise() as any;
  }
  public async checkEmail(email: string): Promise<boolean> {
    return this.http
      .get(`${this.endpoint}/check-email?value=${email}`)
      .toPromise() as any;
  }

  public async init() {
    if (!this.self && this.key)
      await this.ready();
    await super.init();
  }

  public async ready() {
    const { user } = await this.ws.emitAsync('READY', { key: this.key }, this);
    this.self = user;
  }

  public block(id: string, type: keyof UserTypes.Self['ignored'] = 'userIds') {
    const ids = this.self.ignored?.[type].concat(id)
      ?? [id];

    this.ws.emit('USER_UPDATE', {
      key: this.key,
      partialUser: {
        ...this.self,
        ignored: { ...this.self.ignored, [type]: ids }
      },
    }, this);
  }

  public unblock(userId: string) {
    const index = this.self.ignored?.userIds.indexOf(userId);
    this.self.ignored?.userIds.splice(index, 1);

    this.ws.emit('USER_UPDATE', {
      partialUser: {
        ignored: this.self.ignored,
      },
      key: localStorage.getItem('key'),
    }, this);
  }

  public updateSelf(options: Partial.User) {
    return this.ws.emitAsync('USER_UPDATE', {
      key: localStorage.getItem('key'),
      partialUser: {
        ...options,
      }
    }, this);
  }
}
