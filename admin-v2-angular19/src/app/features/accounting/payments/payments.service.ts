import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PaymentsService {
  constructor(private http: HttpClient) {}

  index(params: any = {}, page = 1, limit = 20): Observable<any> {
    params.page = page;
    params.limit = limit;
    return this.http.get(environment.baseUrl + 'admin/payments', { params });
  }

  show(id: number): Observable<any> {
    return this.http.get(environment.baseUrl + `admin/payments/${id}`);
  }
}
