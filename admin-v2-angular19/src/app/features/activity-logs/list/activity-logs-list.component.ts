import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { ActivityLogsService } from '../activity-logs.service';

@Component({
  selector: 'app-activity-logs-list', standalone: true,
  imports: [CommonModule, DatePipe, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <section class="sub-header"><h3>Activity Logs</h3></section>
    @if (pageLoader) { <div class="loading-overlay"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!pageLoader) {
      <section class="table-section"><table class="data-table"><thead><tr><th>Date</th><th>User</th><th>Action</th><th>Description</th></tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.created_at | date:'short' }}</td><td>{{ item.causer?.full_name || 'System' }}</td><td>{{ item.action_type }}</td><td class="desc">{{ item.description }}</td></tr>
        }
        @if (dataList.length === 0) { <tr><td colspan="4" class="empty">No activity logs</td></tr> }
      </tbody></table>
      <div class="pagination-section"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div></section>
    }
  `,
  styles: ['.sub-header h3 { color: #c4272e; margin: 0 0 16px; } .loading-overlay { display: flex; justify-content: center; padding: 48px 0; } .table-section { background: white; border-radius: 8px; padding: 16px; } .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; th, td { padding: 10px 12px; text-align: left; border-bottom: 1px solid #eee; } thead th { background: #f5f5f5; font-weight: 600; } } .desc { max-width: 400px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; } .empty { text-align: center; padding: 24px; color: #999; } .pagination-section { text-align: center; padding: 16px 0; }'],
})
export class ActivityLogsListComponent implements OnInit {
  pageLoader = false; dataList: any[] = [];
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };
  constructor(private titleService: Title, private activityLogs: ActivityLogsService) { this.titleService.setTitle('Activity Logs'); }
  ngOnInit(): void { this.getData(); }
  getData(): void { this.pageLoader = true; this.activityLogs.index({ order: JSON.stringify({ created_at: 'desc' }), page: this.paginator.currentPage, limit: this.paginator.itemsPerPage }).subscribe({ next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data || []; const p = d.record.paginator; if (p) this.paginator = { ...this.paginator, ...p, totalItems: p.total, currentPage: p.current_page }; } this.pageLoader = false; }, error: () => { this.pageLoader = false; } }); }
  changePage(p: number): void { this.paginator.currentPage = p; this.getData(); }
}
