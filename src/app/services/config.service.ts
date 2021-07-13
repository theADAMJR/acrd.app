import { Injectable } from '@angular/core';

const defaultValues = {
  developerMode: false,
  lastReadChangelog: 'v0.0.0a',
  memberListExpanded: true,
  sfxEnabled: true,
  theme: 'HORIZON',
};

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  public init() {
    for (const key in defaultValues) {
      const currentValue = localStorage.getItem(key);
      if (currentValue) continue;
      
      localStorage.setItem(key, defaultValues[key].toString());
    }
  }
  
  public get(key: ConfigKey): boolean {
    return localStorage.getItem(key as string) == 'true';
  }
  public toggle(key: ConfigKey) {
    this.set(key, !this.get(key));
  }
  public getValue(key: ConfigKey): string {
    return localStorage.getItem(key as string);
  }
  public set(key: ConfigKey, value: any) {
    localStorage.setItem(key as string, value.toString());
  }
}

type ConfigKey = keyof typeof defaultValues;