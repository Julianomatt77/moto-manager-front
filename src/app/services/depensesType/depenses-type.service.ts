import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {DepenseType} from "../../models/DepenseType";

@Injectable({
  providedIn: 'root'
})
export class DepensesTypeService {

  private baseUrl = environment.baseUrl;
  private depensesUrl = this.baseUrl + 'depensesTypes';

  constructor(private http: HttpClient) { }

  getDepensesTypes(){
    return this.http.get<any[]>(this.depensesUrl);
  }

  getDepenseType(id: string){
    return this.http.get<DepenseType>(this.depensesUrl + '/${id}');
  }

  saveDepenseType(depenseType: DepenseType){
    return this.http.post<DepenseType>(this.depensesUrl, depenseType);
  }

  patchDepenseType(id: string, data: any){
    return this.http.patch<DepenseType>(this.depensesUrl + '/${id}', data);
  }

  deleteDepenseType(id: string){
    return this.http.delete<DepenseType>(this.depensesUrl + '/${id}')
  }

}
