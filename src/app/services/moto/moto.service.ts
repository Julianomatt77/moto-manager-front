import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DepenseType} from "../../models/DepenseType";
import {Moto} from "../../models/Moto";

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

  deleteMoto(id: string){
    let url = this.motoUrl + '/' + id
    return this.http.delete<Moto>(url)
  }
}
