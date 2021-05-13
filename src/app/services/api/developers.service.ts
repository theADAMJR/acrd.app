import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Lean } from '../../types/entity-types';
import { HTTPWrapper } from './http-wrapper';

@Injectable({
  providedIn: 'root'
})
export class DevelopersService extends HTTPWrapper<Lean.App> {
  protected readonly endpoint = `${environment.endpoint}/dev/apps`;

  protected arr: Lean.App[];
  // TODO: make update as current application
  public self: Lean.App;

  public async create(): Promise<Lean.App> {
    return this.http.get(`${this.endpoint}/new`, this.headers).toPromise() as any;
  }

  public async update(id: string, value: string): Promise<Lean.App> {
    return this.http.patch(`${this.endpoint}/${id}`, value, this.headers).toPromise() as any;
  }

  public async regenToken(id: string): Promise<string> {
    return this.http.get(`${this.endpoint}/${id}/regen-token`, this.headers).toPromise() as any;
  }
}
