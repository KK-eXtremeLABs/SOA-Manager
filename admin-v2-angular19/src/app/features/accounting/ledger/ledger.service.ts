import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class LedgerService {
  constructor(private http: HttpClient) {}

  index(params: any = {}, page = 1, limit = 20): Observable<any> {
    params.page = page;
    params.limit = limit;
    return this.http.get(environment.baseUrl + 'admin/ledger', { params });
  }

  oaLedger(params: any = {}, page = 1, limit = 20): Observable<any> {
    params.page = page;
    params.limit = limit;
    return this.http.get(environment.baseUrl + 'admin/oa-ledger', { params });
  }
}
