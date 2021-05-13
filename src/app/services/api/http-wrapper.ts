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

  protected abstract arr: T[];

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
    return this.arr?.find(i => i.id === id);
  }
  public getAsync(id: string) {
    return this.getCached(id) ?? this.fetch(id);
  }
  /** @deprecated */
  public add(value: T) {
    this.arr.push(value);

    return this.arr;
  }
  public delete(id: string) {
    const index = this.arr.findIndex(v => v.id === id);
    this.arr.splice(index, 1);

    return this.arr;
  }

  public upsert(id: string, value: Partial<T> | T): T {
    const index = this.arr.findIndex(g => g.id === id);
    const existing = this.arr[index];

    if (this.self && this.self?.id === id)
      return Object.assign(this.self, value);

    const isFull = 'id' in value;
    if (!existing && !isFull)
      throw new TypeError('Full object required for adding');
    
    if (isFull) {
      // stackoverflowexception
      console.log(value);
      
      // this.arr.concat(value as T);
    }
    return existing;
  }

  public async fetch(id: string): Promise<T> {
    if (!id) return null;

    return await this.http
      .get(`${this.endpoint}/${id}`, this.headers)
      .toPromise() as any;
  }
  public async fetchAll() {
    return this.arr = (this.key)
      ? await this.http
        .get(this.endpoint, this.headers)
        .toPromise() as any ?? []
      : [];    
  }
}
