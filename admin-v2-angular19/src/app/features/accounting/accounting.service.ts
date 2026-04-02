import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AccountingService {
  constructor(private http: HttpClient) {}

  getBillingSummary(filter: any = null, where: any = {}, isExport: number = 0): Observable<any> {
    const params: any = { export: isExport };
    if (where.companyIds) params.companyIds = JSON.stringify(where.companyIds);
    if (where.associationIds) params.associationIds = JSON.stringify(where.associationIds);
    if (where.fromDate) params.fromDate = where.fromDate;
    if (where.toDate) params.toDate = where.toDate;
    const path = environment.adminUrl + 'reports/billing-summary-report';
    return isExport
      ? this.http.get(path, { params, responseType: 'blob' })
      : this.http.get(path, { params });
  }

  getBankStatement(filter: any = null, where: any = {}, limit = 0, page = 1, isExport = 0): Observable<any> {
    const params: any = { filter: filter ? JSON.stringify(filter) : '{}', limit, page, export: isExport };
    if (where.companyIds) params.companyIds = JSON.stringify(where.companyIds);
    if (where.associationIds) params.associationIds = JSON.stringify(where.associationIds);
    if (where.is_unidentified) params.is_unidentified = where.is_unidentified;
    if (where.fromDate) params.fromDate = where.fromDate;
    if (where.toDate) params.toDate = where.toDate;
    const path = environment.adminUrl + 'banking/statement';
    return isExport
      ? this.http.get(path, { params, responseType: 'blob' })
      : this.http.get(path, { params });
  }

  importBankStatement(data: any): Observable<any> {
    return this.http.post(environment.adminUrl + 'banking/import-bank-statement', data);
  }

  searchBankReference(param: any): Observable<any> {
    return this.http.get(environment.adminUrl + 'banking/search-bank-reference', { params: param });
  }

  addBankReference(data: any): Observable<any> {
    return this.http.post(environment.adminUrl + 'banking/add-bank-reference', data);
  }

  unIdentifyBankTransaction(id: number, data: any = {}): Observable<any> {
    return this.http.put(environment.adminUrl + `banking/${id}/unidentify-bank-transaction`, data);
  }

  identifyBankTransaction(id: number, data: any = {}): Observable<any> {
    return this.http.put(environment.adminUrl + `banking/${id}/identify-bank-transaction`, data);
  }

  deletePermanent(id: number): Observable<any> {
    return this.http.delete(environment.adminUrl + `banking/${id}`);
  }

  getBalances(filter: any = null, where: any = {}, limit = 0, page = 1): Observable<any> {
    const params: any = { filter: filter ? JSON.stringify(filter) : '{}', limit, page };
    if (where.companyIds) params.companyIds = JSON.stringify(where.companyIds);
    if (where.associationIds) params.associationIds = JSON.stringify(where.associationIds);
    if (where.fromDate) params.fromDate = where.fromDate;
    if (where.toDate) params.toDate = where.toDate;
    return this.http.get(environment.adminUrl + 'banking/balances', { params });
  }

  exportBalances(filter: any = null, where: any = {}, limit = 0, page = 1): Observable<Blob> {
    const params: any = { filter: filter ? JSON.stringify(filter) : '{}', limit, page, export: 1 };
    if (where.companyIds) params.companyIds = JSON.stringify(where.companyIds);
    if (where.associationIds) params.associationIds = JSON.stringify(where.associationIds);
    if (where.fromDate) params.fromDate = where.fromDate;
    if (where.toDate) params.toDate = where.toDate;
    return this.http.get(environment.adminUrl + 'banking/balances/export', { params, responseType: 'blob' });
  }
}
