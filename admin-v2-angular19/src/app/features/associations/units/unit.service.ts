import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UnitService {
  constructor(private http: HttpClient) {}
  unitListingSearch(filter: any = {}, associationId: number, page = 0, limit = 0): Observable<any> {
    const params: any = {};
    if (filter.where) params.where = JSON.stringify(filter.where);
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return this.http.get(environment.adminUrl + `units/search-all-units/${associationId}`, { params });
  }
  getOne(id: number, include: any = null): Observable<any> {
    const params: any = {};
    if (include) params.include = JSON.stringify(include);
    return this.http.get(environment.adminUrl + `units/${id}`, { params });
  }
  getUnitTypes(filter: any = {}, page = 0, limit = 0): Observable<any> {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return this.http.get(environment.adminUrl + 'unit-type', { params });
  }
  getOwners(filter: any = {}, associationId: number): Observable<any> {
    return this.http.get(environment.adminUrl + `owner/by-association`, { params: { association_id: associationId.toString() } });
  }
}
