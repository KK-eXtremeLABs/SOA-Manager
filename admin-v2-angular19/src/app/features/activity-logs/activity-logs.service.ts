import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ActivityLogsService {
  constructor(private http: HttpClient) {}
  index(params: any = {}): Observable<any> { return this.http.get(environment.adminUrl + 'activity-logs', { params }); }
  show(id: number): Observable<any> { return this.http.get(environment.adminUrl + `activity-logs/${id}`); }
}
