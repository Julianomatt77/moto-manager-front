import { Injectable } from '@angular/core';
import { environment } from "../../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  private baseUrl = environment.baseUrl;
  private depensesUrl = this.baseUrl + 'depenses';

  constructor(private http: HttpClient) { }

  exportDepenses(){
    let url = this.baseUrl + 'exportDepenses'
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv',
      'Accept': 'text/csv'
    });

    return this.http.get(url, { headers, observe: 'response', responseType: 'blob' });
  }

  exportEntretiens(){
    let url = this.baseUrl + 'exportEntretiens'
    const headers = new HttpHeaders({
      'Content-Type': 'text/csv',
      'Accept': 'text/csv'
    });

    return this.http.get(url, { headers, observe: 'response', responseType: 'blob' });
  }

  handleCsvDownload(response: any, filename: string) {
    const fileName = filename +'.csv';

    const blob = new Blob([response.body], { type: 'text/csv' });

    // Créer un lien invisible pour télécharger le fichier
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;

    // Ajouter le lien au DOM et déclencher le téléchargement
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
