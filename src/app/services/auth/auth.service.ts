import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable()
export class AuthService {

  private baseUrl = environment.baseUrl;
  private loginUrl = this.baseUrl + 'login_check';
  private registerUrl = this.baseUrl + 'register';
  private userInfosUrl = this.baseUrl + 'users-infos';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    // const url = `${this.baseUrl}login_check`;
    const body = { username, password };
    return this.http.post(this.loginUrl, body);
  }

  saveToken(token: string): void {
    localStorage.setItem('mm_token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('mm_token');
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('token');
  }

  getUserInfos(): Observable<any> {
    return this.http.get(this.userInfosUrl);
  }
}
