import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommandDocument } from '../../../api/models/command';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {
  private endpoint = environment.endpoint + '/commands';

  constructor(private http: HttpClient) {}

  async get() {
    return this.http.get(this.endpoint).toPromise() as Promise<CommandDocument[]>;
  }
}
