import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

@Service()
export class MailService {
  private http = inject(HttpClient);
  private baseUrl = environment.base;
  private contactUrl = this.baseUrl + 'contact';

  async contact(from: string, subject: string, message: string): Promise<any> {
    return lastValueFrom(
      this.http.post<any>(this.contactUrl, { from, subject, message })
    );
  }
}
