import { Service, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Depense } from '../../models/Depense';

@Service()
export class DepensesService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private depensesUrl = this.baseUrl + 'depenses';

  readonly depenses = httpResource<Depense[]>(() => this.depensesUrl);

  async save(data: any): Promise<Depense> {
    const result = await lastValueFrom(this.http.post<Depense>(this.depensesUrl, data));
    this.depenses.reload();
    return result;
  }

  async patch(id: string, data: any): Promise<Depense> {
    const result = await lastValueFrom(this.http.patch<Depense>(`${this.depensesUrl}/${id}`, data));
    this.depenses.reload();
    return result;
  }

  async delete(id: string): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.depensesUrl}/${id}`));
    this.depenses.reload();
  }
}
