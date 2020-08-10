import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PayService {
  constructor(private http: HttpClient) {}

  createSession(plan: number): Promise<any> {
    const key = localStorage.getItem('key');
    return this.http.get(`${environment.endpoint}/user/pay?key=${key}&plan=${plan}`).toPromise();
  }
}
