import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralTypes } from '../types/entity-types';
import { WSService } from './ws.service';

// convention over configuration
@Injectable({ providedIn: 'root' })
export abstract class HTTPWrapper<T extends GeneralTypes.SnowflakeEntity> {
  /** Object of the client, or that is being currently used. */
  public self?: T;
  protected abstract endpoint: string;

  protected get headers() {
    return {
      headers: { Authorization: `Bearer ${this.key}` }
    };
  }
  protected get key() {
    return localStorage.getItem('key');
  }

  protected abstract _arr: T[];
  private get arr(): T[] {
    return this._arr;
  };

  constructor(
    protected http: HttpClient,
    protected ws: WSService,
  ) {}

  public async init() {
    if (this.arr.length <= 0)
      await this.fetchAll();
    if (!this.self)
      await this.updateSelf?.();
  }

  public updateSelf?(): Promise<T>;

  public getCached(id: string | undefined) {
    return this.arr?.find(i => i._id === id);
  }
  public getAsync(id: string) {
    return this.getCached(id) ?? this.fetch(id);
  }
  /** @deprecated */
  public add(val: T) {
    const has = this.arr.some(v => v._id === val._id);
    if (has) this.arr;

    this.arr.push(val);
    return this.arr;
  }
  public delete(id: string) {
    const index = this.arr?.findIndex(i => i._id === id);
    this.arr.splice(index, 1);
    return this.arr;
  }

  public upsert(id: string, value: Partial<T>): T {
    const index = this.arr.findIndex(g => g._id === id);
    const existing = this.arr[index];

    if (this.self && this.self._id === id)
      return this.self = { ...this.self, ...value as any };

    if (!existing && !('_id' in value))
      throw new TypeError('Full object required for adding');
    
    ('_id' in value)
      ? this.add(value as T)
      : this.arr[index] = { ...existing, ...value };

    return existing;
  }

  public async fetch(id: string): Promise<T> {
    if (!id)
      throw new TypeError('ID must be defined');

    return await this.http.get(`${this.endpoint}/${id}`, this.headers).toPromise() as any;
  }
  public async fetchAll() {
    return this._arr = (this.key)
      ? await this.http.get(this.endpoint, this.headers).toPromise() as any ?? []
      : [];    
  }
}
