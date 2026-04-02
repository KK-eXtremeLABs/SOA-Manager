import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BillingService {
  constructor(private http: HttpClient) {}

  getList(filter: any = {}, page = 1, limit = 0): Observable<any> {
    const params: any = { page, limit };
    if (filter.where) params.where = JSON.stringify(filter.where);
    if (filter.columns) params.columns = JSON.stringify(filter.columns);
    if (filter.include) params.include = JSON.stringify(filter.include);
    if (filter.orderBy) params.order = JSON.stringify(filter.orderBy);
    return this.http.get(environment.adminUrl + 'billing', { params });
  }

  export(filter: any = {}): Observable<Blob> {
    const params: any = { export: 1 };
    if (filter.where) params.where = JSON.stringify(filter.where);
    if (filter.include) params.include = JSON.stringify(filter.include);
    if (filter.orderBy) params.order = JSON.stringify(filter.orderBy);
    return this.http.get(environment.adminUrl + 'billing', { params, responseType: 'blob' });
  }

  getOne(id: number, include: any = null): Observable<any> {
    const params: any = {};
    if (include) params.include = JSON.stringify(include);
    return this.http.get(environment.adminUrl + `billing/${id}`, { params });
  }

  approve(id: any, data: any): Observable<any> { return this.http.put(environment.adminUrl + `billing/approve/${id}`, data); }
  reject(id: any, data: any): Observable<any> { return this.http.put(environment.adminUrl + `billing/reject/${id}`, data); }
}
