import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BankReferencesService {
  constructor(private http: HttpClient) {}
  index(associationId: number): Observable<any> {
    return this.http.get(environment.adminUrl + `associations/${associationId}/bank-references`);
  }
  delete(associationId: number, id: number): Observable<any> {
    return this.http.delete(environment.adminUrl + `associations/${associationId}/bank-references/${id}`);
  }
}
