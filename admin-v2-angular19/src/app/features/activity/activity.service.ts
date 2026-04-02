import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private http: HttpClient) {}
  getList(filter: any = {}, page = 0, limit = 0): Observable<any> {
    const params: any = {};
    if (filter.where) params.where = JSON.stringify(filter.where);
    if (filter.include) params.include = JSON.stringify(filter.include);
    if (filter.orderBy) params.order = JSON.stringify(filter.orderBy);
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return this.http.get(environment.adminUrl + 'activity', { params });
  }
}
