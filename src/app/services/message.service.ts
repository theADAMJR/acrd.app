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
  private cachedMessages = new Map<string, Lean.Message[]>();

  constructor(
    http: HttpClient,
    ws: WSService,
  ) { super(http, ws); }

  public async getAll(channelId: string, options?: LazyLoadOptions): Promise<Lean.Message[]> {
    return this.cachedMessages.get(channelId)
      ?? this.cachedMessages
        .set(channelId, await this.fetchAll(channelId, options))
        .get(channelId);
  }

  private async fetchAll(channelId: string, options?: LazyLoadOptions) {
    const query = `?start=${options?.start ?? 0}&end=${options?.end ?? 25}`;
    return this.http
      .get(`${this.endpoint}/${channelId}/messages${query}`,this.headers)
      .toPromise() as any;
  }

  public add(message: Lean.Message) {
    const messages = this.cachedMessages.get(message.channelId);
    messages.push(message);

    this.cachedMessages.set(message.channelId, messages);
  }
}

interface LazyLoadOptions { start: number, end: number }
