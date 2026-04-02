import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  constructor(private http: HttpClient) {}

  getList(filter: any = {}, page = 0, limit = 0): Observable<any> {
    const path = environment.adminUrl + 'notifications';
    const params: any = {};
    if (filter.where) params.where = JSON.stringify(filter.where);
    if (filter.columns) params.columns = JSON.stringify(filter.columns);
    if (filter.include) params.include = JSON.stringify(filter.include);
    if (filter.orderBy) params.order = JSON.stringify(filter.orderBy);
    if (page) params.page = page;
    if (limit) params.limit = limit;
    return this.http.get(path, { params });
  }

  markIsRead(id: number): Observable<any> {
    return this.http.put(environment.adminUrl + `notifications/${id}`, {});
  }

  markAllIsRead(): Observable<any> {
    return this.http.post(environment.adminUrl + 'notifications/all', {});
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(environment.adminUrl + 'notifications/unread-count');
  }

  route(value: any, _default: any = '/notifications'): any {
    switch (value.object_type) {
      case 'organization':
        if (value.activity === 'Vendor registered') {
          return [`/vendors/details/${value.object_id}`, { queryParams: { _ref: '/notifications' } }];
        }
        return [`/organizations/details/${value.object_id}`, { queryParams: { _ref: '/notifications' } }];
      case 'user':
        return '/profile/view/';
      case 'notice':
        return `/noticeboard/view/${value.object_id}`;
      case 'task':
        return `/tasks/view/${value.object_id}`;
      default:
        return _default;
    }
  }
}
