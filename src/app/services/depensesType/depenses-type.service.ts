import { Service, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { DepenseType } from '../../models/DepenseType';

@Service()
export class DepensesTypeService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl;
  private depensesUrl = this.baseUrl + 'depensesTypes';

  readonly depensesTypes = httpResource<DepenseType[]>(() => this.depensesUrl);

  async save(name: string): Promise<DepenseType> {
    const result = await lastValueFrom(this.http.post<DepenseType>(this.depensesUrl, { name }));
    this.depensesTypes.reload();
    return result;
  }

  async patch(id: string, data: any): Promise<DepenseType> {
    const result = await lastValueFrom(this.http.patch<DepenseType>(`${this.depensesUrl}/${id}`, data));
    this.depensesTypes.reload();
    return result;
  }

  async delete(id: string): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.depensesUrl}/${id}`));
    this.depensesTypes.reload();
  }
}
