import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean } from '../../types/entity-types';
import { HTTPWrapper } from '../http-wrapper';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService extends HTTPWrapper<Lean.Application> {
  protected readonly endpoint = `${environment.endpoint}/developers/applications`;

  protected _arr: Lean.Application[];
  // TODO: make update as current application
  public self: Lean.Application;

  public async create(): Promise<Lean.Application> {
    return this.http.get(`${this.endpoint}/applications/new`, this.headers).toPromise() as any;
  }

  public async update(id: string, value: string): Promise<Lean.Application> {
    return this.http.patch(`${this.endpoint}/applications/${id}`, value, this.headers).toPromise() as any;
  }

  public async regenToken(id: string): Promise<string> {
    return this.http.get(`${this.endpoint}/applications/${id}/regen-token`, this.headers).toPromise() as any;
  }
}
