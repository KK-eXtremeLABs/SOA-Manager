import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(private http: HttpClient) {}

  getList(filter: any = {}, page = 0, limit = 0): Observable<any> {
    const path = environment.adminUrl + 'roles';
    const params: any = {};
    if (filter.where) params.where = JSON.stringify(filter.where);
    if (filter.columns) params.columns = JSON.stringify(filter.columns);
    if (filter.include) params.include = JSON.stringify(filter.include);
    if (filter.orderBy) params.order = JSON.stringify(filter.orderBy);
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return this.http.get(path, { params });
  }

  getOne(id: number, include = {}): Observable<any> {
    const params: any = {};
    if (include) params.include = JSON.stringify(include);
    return this.http.get(environment.adminUrl + `roles/${id}`, { params });
  }

  create(data: any): Observable<any> {
    return this.http.post(environment.adminUrl + 'roles', data);
  }

  update(id: any, data: any): Observable<any> {
    data.id = id;
    return this.http.put(environment.adminUrl + `roles/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(environment.adminUrl + `roles/${id}`);
  }

  getRolePermissions(id: any): Observable<any> {
    return this.http.get(environment.adminUrl + `roles/${id}/permissions`);
  }
}
