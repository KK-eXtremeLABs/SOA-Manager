import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  getStatisticsCount(): Observable<any> {
    return this.http.get(environment.adminUrl + 'statistics/counts');
  }

  getUserStatisticsCount(): Observable<any> {
    return this.http.get(environment.adminUrl + 'statistics/counts');
  }

  getEservicesCount(): Observable<any> {
    return this.http.get(environment.adminUrl + 'statistics/eservices-count');
  }

  getUserEservicesCount(): Observable<any> {
    return this.http.get(environment.adminUrl + 'statistics/eservices-count');
  }
}
