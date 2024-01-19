import { Injectable } from '@angular/core';
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Entretien} from "../../models/Entretien";

@Injectable({
  providedIn: 'root'
})
export class EntretiensService {

  private baseUrl = environment.baseUrl;
  private entretiensUrl = this.baseUrl + 'entretiens';

  constructor(private http: HttpClient) { }

  getEntretiens(){
    return this.http.get<any[]>(this.entretiensUrl);
  }

  getEntretien(id: string){
    let url = this.entretiensUrl + '/' + id
    return this.http.get<Entretien>(url);
  }

  saveEntretien(entretien: Entretien){
    return this.http.post<Entretien>(this.entretiensUrl, entretien);
  }

  patchEntretien(id: string, data: any){
    let url = this.entretiensUrl + '/' + id
    return this.http.patch<Entretien>(url, data);
  }

  deleteEntretien(id: string){
    let url = this.entretiensUrl + '/' + id
    return this.http.delete<Entretien>(url)
  }

}
