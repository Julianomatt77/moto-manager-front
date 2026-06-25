import { Service, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage/storage.service';
import { Router } from '@angular/router';

@Service()
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storageService = inject(StorageService);
  private baseUrl = environment.baseUrl;
  private tokenName = environment.token_name;

  readonly #isAuthenticated = signal(this.getToken() !== null);
  readonly isAuthenticated = this.#isAuthenticated.asReadonly();

  private loginUrl = this.baseUrl + 'login_check';
  private registerUrl = this.baseUrl + 'register';

  async login(username: string, password?: string): Promise<any> {
    this.#isAuthenticated.set(true);
    const result = await lastValueFrom(
      this.http.post<any>(this.loginUrl, { username, password })
    );
    this.#isAuthenticated.set(true);
    return result;
  }

  saveToken(token: string): void {
    window.sessionStorage.setItem(this.tokenName, token);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(this.tokenName);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  async logout(): Promise<void> {
    this.storageService.clean();
    this.#isAuthenticated.set(false);
    this.router.navigateByUrl('');
  }

  async getUserInfos(): Promise<any> {
    return lastValueFrom(
      this.http.get(this.baseUrl + 'users-infos')
    );
  }

  async register(email: string, password: string): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(this.registerUrl, { email, password })
    );
  }
}
