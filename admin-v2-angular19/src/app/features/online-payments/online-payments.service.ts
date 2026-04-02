import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OnlinePaymentsService {
  constructor(private http: HttpClient) {}
  getOnlinePayments(params: any = {}): Observable<any> { return this.http.get(environment.baseUrl + 'admin/online-payments', { params }); }
  completeOnlinePayment(id: number): Observable<any> { return this.http.put(environment.baseUrl + `admin/online-payments/complete/${id}`, {}); }
}
