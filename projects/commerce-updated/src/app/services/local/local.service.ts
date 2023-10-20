import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FortressService {
  constructor() {}

  set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  get(key: string) {
    const dataString: any = localStorage.getItem(key);
    return JSON.parse(dataString);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }
}
