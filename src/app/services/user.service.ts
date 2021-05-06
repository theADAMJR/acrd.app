import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean, UserTypes } from '../types/entity-types';
import { array } from '../utils/utils';
import { HTTPWrapper } from './http-wrapper';
import { UserAuthService } from './user-auth.service';
import { WSService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class UserService extends HTTPWrapper<Lean.User> {
  public self: UserTypes.Self;
  public endpoint = `${environment.endpoint}/users`;
  protected _arr: Lean.User[] = [];

  public get friends() {
    return this.self.friendIds.map(id => this.getCached(id));
  }
  public get friendRequests() {
    const isOutgoing = (u: Lean.User) => u.friendRequestIds.includes(this.self._id);    

    return this._arr
      .filter(isOutgoing)
      .concat(this.self.friendRequestIds
        .map(id => this.getCached(id))
      )
      .filter(array.distinctBy('_id'));
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
    return this.http.get(`${this.endpoint}/bots`).toPromise() as any;
  }

  public async updateSelf(): Promise<Lean.User> {
    return this.self = await this.http.get(`${this.endpoint}/self`, this.headers).toPromise() as any;
  }

  public async checkUsername(username: string): Promise<boolean> {
    return this.http.get(`${this.endpoint}/check-username?value=${username}`).toPromise() as any;
  }
  public async checkEmail(email: string): Promise<boolean> {
    return this.http.get(`${this.endpoint}/check-email?value=${email}`).toPromise() as any;
  }

  public async init() {
    if (!this.self) {
      const { user } = await this.ready();
      this.self = user;
    }
    await super.init();
  }

  private ready() {
    return this.ws.emitAsync('READY', { key: localStorage.getItem('key') }, this);
  }

  public block(userId: string) {
    const userIds = this.self.ignored?.userIds.concat(userId)
      ?? [userId];

    this.ws.emit('USER_UPDATE', {
      partialUser: {
        ...this.self,
        ignored: { ...this.self.ignored, userIds }
      },
      key: localStorage.getItem('key'),
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
}
