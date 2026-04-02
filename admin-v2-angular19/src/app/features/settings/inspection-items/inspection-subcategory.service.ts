import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InspectionSubcategoryService {
  constructor(private http: HttpClient) {}
  store(categoryId: number, data: any): Observable<any> {
    return this.http.post(environment.adminUrl + `inspections/categories/${categoryId}/subcatgories`, data);
  }
}
