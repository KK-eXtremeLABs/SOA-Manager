import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { BillingService } from '../billing.service';
import { ProfileService } from '../../../../core/services/profile.service';
import { Helpers } from '../../../../core/utils/helpers';
import { ColorPipe } from '../../../../shared/pipes/color.pipe';

@Component({
  selector: 'app-billing-list', standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule, ColorPipe],
  template: `
    <h4>Subscription Bills</h4>
    @if (pageLoader) { <div class="loading-overlay"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!pageLoader) {
      <div class="filter-row">
        <input type="text" [(ngModel)]="searchData.reference.value" (keyup.enter)="search()" placeholder="Reference..." class="filter-input" />
        <select [(ngModel)]="searchData.status.value" (change)="search()" class="filter-input">
          <option value="">All Statuses</option>
          @for (s of statusOptions; track s.value) { <option [value]="s.value">{{ s.label }}</option> }
        </select>
        <button mat-icon-button color="primary" (click)="search()"><mat-icon>search</mat-icon></button>
        <button mat-icon-button color="warn" (click)="clearFilter()"><mat-icon>close</mat-icon></button>
        <button mat-stroked-button (click)="export()"><mat-icon>download</mat-icon> Export</button>
      </div>
      <div class="table-wrapper"><table class="data-table"><thead><tr>
        <th class="pointer" (click)="sort('reference')">Reference</th><th>Company</th><th>Association</th>
        <th class="pointer" (click)="sort('bill_date')">Bill Date</th><th>Amount</th><th>VAT</th><th>Total</th>
        <th [style.color]="'status' | color">Status</th>
      </tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.reference }}</td><td>{{ item.company?.company_name }}</td><td>{{ item.association?.name }}</td>
          <td>{{ item.bill_date | date:'mediumDate' }}</td><td>{{ item.amount | currency:'AED ':'symbol':'0.2-2' }}</td>
          <td>{{ item.vat | currency:'AED ':'symbol':'0.2-2' }}</td><td>{{ item.total_amount | currency:'AED ':'symbol':'0.2-2' }}</td>
          <td><span [style.color]="item.status | color">{{ item.status }}</span></td></tr>
        }
        @if (dataList.length === 0) { <tr><td colspan="8" class="empty">No bills found</td></tr> }
      </tbody></table></div>
      <div class="pagination-section"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div>
    }
  `,
  styles: ['h4 { color: #c4272e; margin-bottom: 16px; } .loading-overlay { display: flex; justify-content: center; padding: 48px 0; } .filter-row { display: flex; gap: 8px; align-items: center; margin-bottom: 16px; flex-wrap: wrap; } .filter-input { padding: 8px; border: 1px solid #ddd; border-radius: 4px; font-size: 0.875rem; } .table-wrapper { overflow-x: auto; } .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; } thead th { background: #f5f5f5; font-weight: 600; } } .pointer { cursor: pointer; } .empty { text-align: center; padding: 24px; color: #999; } .pagination-section { text-align: center; padding: 16px 0; }'],
})
export class BillingListComponent implements OnInit {
  pageLoader = false; dataList: any[] = []; error: string | null = null;
  where: any[] = []; order: any = { created_at: 'desc' };
  include = ['company:id,company_name', 'association:id,name', 'pricing'];
  searchData: any = { reference: { column: 'reference', operator: 'like', value: '' }, status: { column: 'status', operator: '=', value: '' } };
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };
  statusOptions = [{ label: 'Not Paid', value: 'Not Paid' }, { label: 'Payment Sent', value: 'Payment Sent' }, { label: 'Paid', value: 'Paid' }, { label: 'Rejected', value: 'Rejected' }];

  constructor(private titleService: Title, private route: ActivatedRoute, private billing: BillingService, private profileService: ProfileService, private snackBar: MatSnackBar) { this.titleService.setTitle('Billing'); }
  ngOnInit(): void { this.route.queryParams.subscribe(p => { this.paginator.currentPage = p['page'] || 1; this.search(); }); }
  getData(): void { this.pageLoader = true; this.billing.getList({ where: this.where, orderBy: this.order, include: this.include }, this.paginator.currentPage, this.paginator.itemsPerPage).subscribe({ next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data; const p = d.record.paginator; if (p) this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; } this.pageLoader = false; }, error: () => { this.pageLoader = false; } }); }
  search(): void { this.where = Helpers.buildWhere(this.searchData); this.getData(); }
  clearFilter(): void { for (const k in this.searchData) this.searchData[k].value = ''; this.search(); }
  sort(col: string): void { this.order = this.order[col] ? { [col]: this.order[col] === 'asc' ? 'desc' : 'asc' } : { [col]: 'asc' }; this.search(); }
  changePage(p: number): void { this.paginator.currentPage = p; this.search(); }
  export(): void { this.billing.export({ where: this.where, orderBy: this.order, include: this.include }).subscribe((blob: Blob) => { Helpers.downloadFile(blob, 'bills'); }); }
}
