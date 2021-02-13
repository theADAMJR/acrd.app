import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService {
  private readonly endpoint = `${environment.endpoint}/developers`;

  private get headers() {
    return {
      Authorization: localStorage.getItem('key')
    };
  }

  constructor(private http: HttpClient) {}

  async get(id: string): Promise<any> {
    return this.http.get(`${this.endpoint}/applications/${id}`, { headers: this.headers }).toPromise();
  }

  async getAll(): Promise<any> {
    return this.http.get(`${this.endpoint}/applications`, { headers: this.headers }).toPromise();
  }

  async create(): Promise<any> {
    return this.http.get(`${this.endpoint}/applications/new`, { headers: this.headers }).toPromise();
  }

  async update(id: any, value: any): Promise<any> {
    return this.http.patch(`${this.endpoint}/applications/${id}`, value, { headers: this.headers }).toPromise();
  }
}
