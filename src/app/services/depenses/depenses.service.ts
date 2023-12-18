import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {Depense} from "../../models/Depense";

@Injectable({
  providedIn: 'root'
})
export class DepensesService {

  private baseUrl = environment.baseUrl;
  private depensesUrl = this.baseUrl + 'depenses';

  constructor(private http: HttpClient) { }

  getDepenses(){
    return this.http.get<any[]>(this.depensesUrl);
  }

  getDepense(id: string){
    let url = this.depensesUrl + '/' + id
    return this.http.get<Depense>(url);
  }

  saveDepense(depense: Depense){
    return this.http.post<Depense>(this.depensesUrl, depense);
  }

  patchDepense(id: string, data: any){
    let url = this.depensesUrl + '/' + id
    return this.http.patch<Depense>(url, data);
  }

  deleteDepense(id: string){
    let url = this.depensesUrl + '/' + id
    return this.http.delete<Depense>(url)
  }

}
