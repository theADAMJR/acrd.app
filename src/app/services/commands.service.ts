import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import Fuse from 'fuse.js';

@Injectable({
  providedIn: 'root'
})
export class CommandsService {
  private _commands = [];
  get commands() { return this._commands ?? []; }

  private endpoint = environment.endpoint + '/commands';

  constructor(private http: HttpClient) {}

  async init() {
    if (this.commands.length <= 0)
      await this.updateCommands();
  }

  async updateCommands() {
    this._commands = await this.http.get(this.endpoint).toPromise() as any;
  }

  search(query: string) {
    const fuse = new Fuse(this.commands, {
      includeScore: true,
      keys: [
        { name: 'name', weight: 1 },
        { name: 'description', weight: 0.5 },
        { name: 'usage', weight: 0.3 }
      ]
    }); 
    
    return fuse
      .search(query)
      .map(r => r.item); 
  }
}
