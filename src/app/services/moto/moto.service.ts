import { Service, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { httpResource } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { Moto } from '../../models/Moto';

@Service()
export class MotoService {
  private http = inject(HttpClient);
  private baseUrl = environment.baseUrl + 'motos';

  readonly motos = httpResource<Moto[]>(() => this.baseUrl);
  readonly deactivatedMotos = httpResource<Moto[]>(() => `${this.baseUrl}/deactivated`);

  async save(data: any): Promise<Moto> {
    const result = await lastValueFrom(this.http.post<Moto>(this.baseUrl, data));
    this.motos.reload();
    return result;
  }

  async patch(id: string, data: any): Promise<Moto> {
    const result = await lastValueFrom(this.http.patch<Moto>(`${this.baseUrl}/${id}`, data));
    this.motos.reload();
    return result;
  }

  async reactivate(id: string): Promise<Moto> {
    const result = await lastValueFrom(this.http.patch<Moto>(`${this.baseUrl}/reactivate/${id}`, {}));
    this.reloadAll();
    return result;
  }

  async delete(id: string): Promise<void> {
    await lastValueFrom(this.http.delete(`${this.baseUrl}/${id}`));
    this.reloadAll();
  }

  private reloadAll(): void {
    this.motos.reload();
    this.deactivatedMotos.reload();
  }
}
