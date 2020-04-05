import { Injectable, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint = environment.endpoint;

  constructor(private http: HttpClient) {}

  authenticate(code: string) {
    return this.http.get(`${this.endpoint}/auth?code=${code}`).toPromise() as Promise<string>;
  }
}
