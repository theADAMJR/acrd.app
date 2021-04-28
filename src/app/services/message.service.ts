import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean } from '../types/entity-types';
import { HTTPWrapper } from './http-wrapper';
import { WSService } from './ws.service';

@Injectable({
  providedIn: 'root'
})
export class MessageService extends HTTPWrapper {
  private readonly endpoint = environment.endpoint + '/channels';
  private cached = new Map<string, Lean.Message[]>();

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

  public async fetchAll(channelId: string, options?: LazyLoadOptions) {
    const query = `?start=${options?.start ?? 0}&end=${options?.end ?? 25}`;
    const messages = this.http
      .get(`${this.endpoint}/${channelId}/messages${query}`, this.headers)
      .toPromise() as any;
    
    this.getAll(channelId).push(messages);
    return messages;
  }

  public async add(message: Lean.Message) {
    const messages = this.getAll(message.channelId);
    messages.push(message);

    this.cached.set(message.channelId, messages);
  }
}

interface LazyLoadOptions { start: number, end: number }
