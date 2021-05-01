import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean } from '../types/entity-types';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends HTTPWrapper<Lean.Message> {
  protected readonly endpoint = environment.endpoint + '/channels';
  private cached = new Map<string, Lean.Message[]>();
  public self = undefined;

  protected _arr: Lean.Message[];
  public get messages(): Lean.Message[] {
    return this._arr = Array
      .from(this.cached.values())
      .flat();
  }

  constructor(
    http: HttpClient,
    ws: WSService,
  ) { super(http, ws); }

  public getAll(channelId: string): Lean.Message[] {
    return this.cached.get(channelId)
      ?? this.cached
        .set(channelId, [])
        .get(channelId);
  }

  // TODO: eventually use override keyword
  public overrideAdd(message: Lean.Message) {
    const messages = this.getAll(message.channelId);
    messages.push(message);

    this.cached.set(message.channelId, messages);
  }

  // TODO: eventually use override keyword
  public async overrideFetchAll(channelId: string, options?: LazyLoadOptions): Promise<Lean.Message[]> {
    const query = `?start=${options?.start ?? 0}&end=${options?.end ?? 25}`;
    const messages = await this.http
      .get(`${this.endpoint}/${channelId}/messages${query}`, this.headers)
      .toPromise() as any;
    
    this.getAll(channelId).push(messages);
    return messages;
  }
}

interface LazyLoadOptions { start: number, end: number }
