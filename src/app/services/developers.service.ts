import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean } from '../types/entity-types';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {
  private readonly endpoint = `${environment.endpoint}/developers`;

  private get headers() {
    return {
      Authorization: `Bearer ${localStorage.getItem('key')}`,
    };
  }

  constructor(private http: HttpClient) {}

  async get(id: string): Promise<Lean.Application> {
    return this.http.get(`${this.endpoint}/applications/${id}`, { headers: this.headers }).toPromise() as any;
  }

  async getAll(): Promise<Lean.Application[]> {
    return this.http.get(`${this.endpoint}/applications`, { headers: this.headers }).toPromise() as any;
  }

  async create(): Promise<Lean.Application> {
    return this.http.get(`${this.endpoint}/applications/new`, { headers: this.headers }).toPromise() as any;
  }

  async update(id: string, value: string): Promise<Lean.Application> {
    return this.http.patch(`${this.endpoint}/applications/${id}`, value, { headers: this.headers }).toPromise() as any;
  }

  async regenToken(id: string): Promise<string> {
    return this.http.get(`${this.endpoint}/applications/${id}/regen-token`, { headers: this.headers }).toPromise() as any;
  }

  async delete() {
    // TODO: implement
  }
}
