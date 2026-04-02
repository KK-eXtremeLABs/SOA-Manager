import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InspectionCategoryService {
  constructor(private http: HttpClient) {}
  index(): Observable<any> { return this.http.get(environment.adminUrl + 'inspections/categories'); }
  store(data: any): Observable<any> { return this.http.post(environment.adminUrl + 'inspections/categories', data); }
}
