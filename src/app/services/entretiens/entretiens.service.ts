import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Entretien } from '../../models/Entretien';

@Service()
export class EntretiensService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private entretiensUrl = this.baseUrl + 'entretiens';

  readonly entretiens = httpResource<Entretien[]>(() => this.entretiensUrl);

  async save(data: any): Promise<Entretien> {
    const result = await lastValueFrom(this.http.post<Entretien>(this.entretiensUrl, data));
    this.entretiens.reload();
    return result;
  }

  async patch(id: string, data: any): Promise<Entretien> {
    const result = await lastValueFrom(this.http.patch<Entretien>(`${this.entretiensUrl}/${id}`, data));
    this.entretiens.reload();
    return result;
  }

  async delete(id: string): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.entretiensUrl}/${id}`));
    this.entretiens.reload();
  }
}
