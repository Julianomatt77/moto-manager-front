import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MailService {
  private baseUrl = environment.base;
  private contactUrl = this.baseUrl + 'contact';

  constructor(private http: HttpClient) { }

  contact(from: string, subject: string, message: string): Observable<any> {
    const body = { "from": from, "subject": subject, "message": message };
    return this.http.post<any>(this.contactUrl, body)
  }

}
