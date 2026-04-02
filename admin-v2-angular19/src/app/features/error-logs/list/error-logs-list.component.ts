import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ErrorLogsService } from '../error-logs.service';

@Component({
  selector: 'app-error-logs-list', standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <section class="sub-header"><h3>Error Logs</h3></section>
    @if (pageLoader) { <div class="loading-overlay"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!pageLoader) {
      <section class="table-section"><table class="data-table"><thead><tr><th>Date</th><th>Company</th><th>Exception</th><th>Message</th><th>Actions</th></tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.created_at | date:'short' }}</td><td>{{ item.company?.company_name }}</td><td class="exception">{{ item.exception }}</td><td class="message">{{ item.message }}</td>
          <td><button mat-icon-button color="warn" (click)="deleteLog(item.id)"><mat-icon>delete</mat-icon></button></td></tr>
        }
        @if (dataList.length === 0) { <tr><td colspan="5" class="empty">No error logs</td></tr> }
      </tbody></table>
      <div class="pagination-section"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div></section>
    }
  `,
  styles: ['.sub-header h3 { color: #c4272e; margin: 0 0 16px; } .loading-overlay { display: flex; justify-content: center; padding: 48px 0; } .table-section { background: white; border-radius: 8px; padding: 16px; } .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; } thead th { background: #f5f5f5; font-weight: 600; } } .exception { max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .message { max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .empty { text-align: center; padding: 24px; color: #999; } .pagination-section { text-align: center; padding: 16px 0; }'],
})
export class ErrorLogsListComponent implements OnInit {
  pageLoader = false; dataList: any[] = [];
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };
  constructor(private titleService: Title, private errorLogs: ErrorLogsService) { this.titleService.setTitle('Error Logs'); }
  ngOnInit(): void { this.getData(); }
  getData(): void { this.pageLoader = true; this.errorLogs.getList({ orderBy: { created_at: 'desc' } }, this.paginator.currentPage, this.paginator.itemsPerPage).subscribe({ next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data || []; const p = d.record.paginator; if (p) this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; } this.pageLoader = false; }, error: () => { this.pageLoader = false; } }); }
  changePage(p: number): void { this.paginator.currentPage = p; this.getData(); }
  deleteLog(id: number): void { this.errorLogs.delete(id).subscribe(() => this.getData()); }
}
