import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MusicService {
  endpoint = environment.endpoint + '/guilds';

  private refreshList: number;

  private _list = [];
  get list() { return this._list; }
  
  private _paused = false;
  get paused() { return this._paused; }

  private _current = 0;
  get current() { return this._current; }
  
  private _max = Infinity;
  get max() { return this._max; }
  
  private get key() {
    return localStorage.getItem('key');
  }

  constructor(private http: HttpClient) {}

  async toggle(id: string) {
    try {
      (this.paused) 
        ? await this.http.get(`${this.endpoint}/${id}/music/resume?key=${this.key}`).toPromise() as Promise<any>
        : await this.http.get(`${this.endpoint}/${id}/music/pause?key=${this.key}`).toPromise() as Promise<any>;
      
      this._paused = !this.paused;
    } catch {}
  }

  async updateList(id: string) {
    this._list = await (this.http.get(`${this.endpoint}/${id}/music/list?key=${this.key}`)
      .toPromise() as Promise<any>);

    if (this.list.length === 1) {
      this._paused = false;

      clearInterval(this.refreshList);
      this.refreshList = window.setInterval(() => this.incrementPosition(id), 1 * 1000);
    }
  }

  private async incrementPosition(id: string) {
    if (this.paused || this.list.length <= 0) return;

    this._current++;

    this._max = this.list[0].duration / 1000;
    if (this._current >= this._max) {
      this._current = 0;
      await this.updateList(id);
    }
  }

  async skip(id: string) {
    await this.http.get(`${this.endpoint}/${id}/music/skip?key=${this.key}`).toPromise() as Promise<any>;
    this.list.splice(0, 1);
    this._current = 0;
  }

  async play(id: string, query: string) {
    await this.http.get(`${this.endpoint}/${id}/music/play?key=${this.key}&query=${query}`).toPromise() as Promise<any>;
    await this.updateList(id);
  }

  async stop(id: string) {
    await this.http.get(`${this.endpoint}/${id}/music/stop?key=${this.key}`).toPromise() as Promise<any>;
    this._paused = true;
    this._list = [];
    this._current = 0;
  }

  async removeTrack(id: string, position: number) {
    await this.http.get(`${this.endpoint}/${id}/music/remove/${position}?key=${this.key}`).toPromise() as Promise<any>;    
    await this.updateList(id);
  }

  async seek(id: string, position: number) {
    await this.http.get(`${this.endpoint}/${id}/music/seek/${position}?key=${this.key}`).toPromise() as Promise<any>;
    this._current = position;
  }

  setVolume(id: string, value: number) {
    return this.http.get(`${this.endpoint}/${id}/music/set-volume/${value}?key=${this.key}`).toPromise() as Promise<any>;
  }

  async shuffle(id: string) {
    await this.http.get(`${this.endpoint}/${id}/music/shuffle?key=${this.key}`).toPromise() as Promise<any>;
    await this.updateList(id);
  }
}
