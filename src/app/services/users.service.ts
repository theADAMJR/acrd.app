import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean, UserTypes } from '../types/entity-types';
import { HTTPWrapper } from './http-wrapper';

@Injectable({ providedIn: 'root' })
export class UsersService extends HTTPWrapper {
  public endpoint = `${environment.endpoint}/users`;
  public knownUsers: Lean.User[] = [];
  public user: UserTypes.Self;
  
  public async init() {
    if (!this.user)
      await this.updateUser();
    if (this.knownUsers.length <= 0)
      await this.updateKnownUsers();
  }

  public upsertCached(userId: string, updated: Lean.User) {
    const index = this.knownUsers?.findIndex(u => u._id === userId);
    (index < 0)
      ? this.knownUsers.push(updated)
      : this.knownUsers[index] = updated;
  }

  public getUnknown(userId: string): Lean.User {
    return {
      _id: userId,
      avatarURL: `${environment.endpoint}/avatars/unknown.png`,
      badges: [],
      bot: false,
      createdAt: new Date(),
      friendIds: [],
      friendRequests: [],
      guilds: [],
      status: 'OFFLINE',
      username: `Unknown - ${userId}`,
      voice: new UserTypes.VoiceState(),
    }
  } 

  public async updateUser() {
    this.user = (this.key)
      ? await this.http.get(this.endpoint, this.headers).toPromise() as any
      : null;
  }
  public async updateKnownUsers() {
    this.knownUsers = (this.key)
      ? await this.http.get(`${this.endpoint}/known`, this.headers).toPromise() as any ?? []
      : [];
  }

  public get(id: string): Promise<Lean.User> {
    return this.http.get(`${this.endpoint}/${id}`, this.headers).toPromise() as any;
  }
  public getKnown(id: string): Lean.User {
    return this.knownUsers?.find(u => u._id === id)
      ?? this.getUnknown(id);
  }
  public getFriends() {
    return this.user.friendIds
      .map(id => this.getKnown(id));
  }

  public addKnownUser(user: Lean.User) {
    const userInArray = this.knownUsers.some(u => u._id === user._id);
    if (!userInArray)
      this.knownUsers.push(user);
  }

  public avatarURL(id: string) {
    return `${this.endpoint}/${id}/avatar`;
  }

  public uploadAvatar(avatar: File): Promise<any> {
    return this.http
      .post(`${this.endpoint}/upload-avatar`, { avatar }, this.headers)
      .toPromise();
  }

  public getBots(): Promise<Lean.User[]> {
    return this.http.get(`${this.endpoint}/bots`).toPromise() as any;
  }

  public async checkUsername(username: string): Promise<boolean> {
    return this.http.get(`${this.endpoint}/check-username?value=${username}`).toPromise() as any;
  }
  public async checkEmail(email: string): Promise<boolean> {
    return this.http.get(`${this.endpoint}/check-email?value=${email}`).toPromise() as any;
  }

  public async blockUser(id: string) {
    const userIds = this.user.ignored?.userIds?.concat(id) ?? [id];

    return this.emit('USER_UPDATE', {
      key: this.key,
      partialUser: {
        ...this.user,
        ignored: { userIds },
      }
    });
  }

  public async unblockUser(id: string) {
    const index = this.user.ignored?.userIds?.indexOf(id);
    const userIds = this.user.ignored?.userIds?.splice(index, 1) ?? [];

    return this.emit('USER_UPDATE', {
      key: this.key,
      partialUser: {
        ...this.user,
        ignored: { userIds },
      }
    });
  }
}
