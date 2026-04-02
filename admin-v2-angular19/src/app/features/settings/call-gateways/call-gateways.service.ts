import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CallGatewaysService {
  constructor(private http: HttpClient) {}
  index(params: any = {}): Observable<any> { return this.http.get(environment.adminUrl + 'call-gateway', { params }); }
  create(data: any): Observable<any> { return this.http.post(environment.adminUrl + 'call-gateway', data); }
  update(id: any, data: any): Observable<any> { return this.http.put(environment.adminUrl + `call-gateway/${id}`, data); }
  delete(id: any): Observable<any> { return this.http.delete(environment.adminUrl + `call-gateway/${id}`); }
}
