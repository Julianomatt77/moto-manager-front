import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';

@Service()
export class ExportService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;

  async exportDepenses(): Promise<Blob> {
    const url = this.baseUrl + 'exportDepenses';
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv',
      'Accept': 'text/csv'
    });
    const response = await lastValueFrom(
      this.http.get(url, { headers, observe: 'response', responseType: 'blob' })
    );
    return response.body!;
  }

  async exportEntretiens(): Promise<Blob> {
    const url = this.baseUrl + 'exportEntretiens';
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv',
      'Accept': 'text/csv'
    });
    const response = await lastValueFrom(
      this.http.get(url, { headers, observe: 'response', responseType: 'blob' })
    );
    return response.body!;
  }

  downloadBlob(blob: Blob, filename: string): void {
    const fileName = filename + '.csv';
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
