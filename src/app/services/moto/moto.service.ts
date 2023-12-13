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
    return this.http.get<Moto>(this.motoUrl + '/${id}');
  }

  saveMoto(moto: Moto){
    return this.http.post<Moto>(this.motoUrl, moto);
  }

  patchMoto(id: string, data: any){
    return this.http.patch<Moto>(this.motoUrl + '/${id}', data);
  }

  deleteMotoType(id: string){
    return this.http.delete<Moto>(this.motoUrl + '/${id}')
  }
}
