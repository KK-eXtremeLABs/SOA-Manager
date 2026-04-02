import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { OnlinePaymentsService } from '../online-payments.service';
import { ColorPipe } from '../../../shared/pipes/color.pipe';

@Component({
  selector: 'app-online-payments-listing', standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule, ColorPipe],
  template: `
    <h4>Online Payments</h4>
    @if (pageLoader) { <div class="loading-overlay"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!pageLoader) {
      <section class="table-section"><table class="data-table"><thead><tr><th>Reference</th><th>Company</th><th>Association</th><th>Amount</th><th>Date</th><th>Method</th><th>Status</th><th>Actions</th></tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.reference }}</td><td>{{ item.company?.company_name }}</td><td>{{ item.association?.name }}</td><td>{{ item.amount | currency:'AED ':'symbol':'0.2-2' }}</td><td>{{ item.datetime | date:'short' }}</td><td>{{ item.payment_method }}</td><td><span [style.color]="item.status | color">{{ item.status }}</span></td>
          <td>@if (item.status === 'pending') { <button mat-icon-button color="primary" (click)="complete(item.id)" matTooltip="Complete"><mat-icon>check_circle</mat-icon></button> }</td></tr>
        }
        @if (dataList.length === 0) { <tr><td colspan="8" class="empty">No payments found</td></tr> }
      </tbody></table>
      <div class="pagination-section"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div></section>
    }
  `,
  styles: ['h4 { color: #c4272e; margin-bottom: 16px; } .loading-overlay { display: flex; justify-content: center; padding: 48px 0; } .table-section { background: white; border-radius: 8px; padding: 16px; } .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; } thead th { background: #f5f5f5; font-weight: 600; } } .empty { text-align: center; padding: 24px; color: #999; } .pagination-section { text-align: center; padding: 16px 0; }'],
})
export class OnlinePaymentsListingComponent implements OnInit {
  pageLoader = false; dataList: any[] = [];
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };
  constructor(private titleService: Title, private payments: OnlinePaymentsService, private snackBar: MatSnackBar) { this.titleService.setTitle('Online Payments'); }
  ngOnInit(): void { this.getData(); }
  getData(): void { this.pageLoader = true; this.payments.getOnlinePayments({ page: this.paginator.currentPage, limit: this.paginator.itemsPerPage }).subscribe({ next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data || []; const p = d.record.paginator; if (p) this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; } this.pageLoader = false; }, error: () => { this.pageLoader = false; } }); }
  changePage(p: number): void { this.paginator.currentPage = p; this.getData(); }
  complete(id: number): void { this.payments.completeOnlinePayment(id).subscribe({ next: () => { this.snackBar.open('Payment completed', 'Close', { duration: 3000 }); this.getData(); } }); }
}
