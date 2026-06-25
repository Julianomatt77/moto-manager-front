import { Service } from '@angular/core';
import { environment } from '../../../environments/environment';

const USER_KEY = environment.user_key;

@Service()
export class StorageService {

  clean(): void {
    window.sessionStorage.clear();
  }

  saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

  isLoggedIn(): boolean {
    return window.sessionStorage.getItem(USER_KEY) !== null;
  }
}
