import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { WSService } from './ws.service';

@Injectable({ providedIn: 'root' })
export class HTTPWrapper {
  protected get headers() {
    return { headers: { Authorization: `Bearer ${localStorage.getItem('key')}` } };
  }

  protected get key() {
    return localStorage.getItem('key');
  }

  constructor(
    protected http: HttpClient,
    protected ws: WSService,
  ) {}
}
