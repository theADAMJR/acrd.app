import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GeneralTypes, Lean, UserTypes } from '../../types/entity-types';
import { WSService } from '../ws.service';

// convention over configuration
@Injectable({ providedIn: 'root' })
export abstract class HTTPWrapper<T extends GeneralTypes.SnowflakeEntity> {
  /** Object of the client, or that is being currently used. */
  public self?: T;
  private initialized = false;
  protected abstract endpoint: string;

  protected get headers() {
    return {
      headers: {
        Authorization: `Bearer ${this.key}`,
      }
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
    if (this.initialized) return;

    if (this.arr.length <= 0)
      await this.fetchAll();
    if (!this.self)
       await this.fetchSelf?.();

    this.initialized = true;
  }

  public fetchSelf?(): Promise<T>;

  public getCached(id: string | undefined) {
    return this.arr?.find(i => i._id === id);
  }
  public getAsync(id: string) {
    return this.getCached(id) ?? this.fetch(id);
  }
  /** @deprecated */
  public add(val: T) {
    this.upsert(val._id, val);

    return this.arr;
  }
  public delete(id: string) {
    const index = this.arr.findIndex(v => v._id === id);
    this.arr.splice(index, 1);

    return this.arr;
  }

  public upsert(id: string, value: Partial<T>): T {
    const index = this.arr.findIndex(g => g._id === id);
    const existing = this.arr[index];

    if (this.self && this.self?._id === id)
      return Object.assign(this.self, value);

    const isFull = '_id' in value;
    if (!existing && !isFull)
      throw new TypeError('Full object required for adding');
    
    (isFull)
      ? this.arr.push(value as T)
      : Object.assign(this.arr[index], value);

    return existing;
  }

  public async fetch(id: string): Promise<T> {
    if (!id) return null;

    return await this.http
      .get(`${this.endpoint}/${id}`, this.headers)
      .toPromise() as any;
  }
  public async fetchAll() {
    return this._arr = (this.key)
      ? await this.http
        .get(this.endpoint, this.headers)
        .toPromise() as any ?? []
      : [];    
  }
}
