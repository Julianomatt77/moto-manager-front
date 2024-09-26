import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import { HttpClient } from "@angular/common/http";
import { Moto } from "../../models/Moto";
import {map, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MotoService {
  private baseUrl = environment.baseUrl;
  private motoUrl = this.baseUrl + 'motos';

  constructor(private http: HttpClient) { }

  getMotos(){
    return this.http.get<any[]>(this.motoUrl);
  }

  getDeactivatedMotos(){
    return this.http.get<any[]>(this.motoUrl + '/deactivated');
  }

  getMoto(id: string){
    let url = this.motoUrl + '/' + id
    return this.http.get<Moto>(url);
  }

  saveMoto(moto: Moto){
    return this.http.post<Moto>(this.motoUrl, moto);
  }

  patchMoto(id: string, data: any){
    let url = this.motoUrl + '/' + id
    return this.http.patch<Moto>(url, data);
  }

  reactivateMoto(id: string){
    let url = this.motoUrl + '/reactivate/' + id
    return this.http.patch<Moto>(url, {});
  }

  deleteMoto(id: string){
    let url = this.motoUrl + '/' + id
    return this.http.delete<Moto>(url)
  }

  getAllMotos(): Observable<any> {
    return this.getMotos().pipe(
      map(data => data), // Vous pouvez transformer les données ici si nécessaire
    );
  }
}
