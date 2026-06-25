import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {BehaviorSubject, Observable, tap} from 'rxjs';
import {StorageService} from "../storage/storage.service";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  public isAuthenticatedSubject!: BehaviorSubject<boolean>;
  isAuthenticated!: Observable<boolean>;

  private baseUrl = environment.baseUrl;
  private tokenName = environment.token_name;
  private loginUrl = this.baseUrl + 'login_check';
  private registerUrl = this.baseUrl + 'register';
  private userInfosUrl = this.baseUrl + 'users-infos';

  constructor(private http: HttpClient, private router: Router, private storageService: StorageService) {
    this.isAuthenticatedSubject = new BehaviorSubject<boolean>(this.getToken() !== null);
    this.isAuthenticated = this.isAuthenticatedSubject.asObservable();
  }

  login(username: string, password?: string): Observable<any> {
    this.isAuthenticatedSubject.next(true);
    return this.http
      .post(this.loginUrl, {
        username,
        password,
      })
      .pipe(
        tap(() => {
          this.isAuthenticatedSubject.next(true);
        })
      );
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

  logout(): Observable<any> {
    this.storageService.clean();
    this.isAuthenticatedSubject.next(false);
    this.router.navigateByUrl('');

    return this.isAuthenticatedSubject;
  }

  getUserInfos(): Observable<any> {
    return this.http.get(this.userInfosUrl);
  }

  register(email: string, password: string){
    return this.http.post<any>(this.registerUrl, {
      email,
      password,
    });
  }

}
