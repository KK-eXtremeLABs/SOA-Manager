import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-activity-logs-details', standalone: true, imports: [CommonModule, DatePipe, MatCardModule],
  template: `@if (log) { <mat-card><mat-card-header><mat-card-title>Activity Log Details</mat-card-title></mat-card-header><mat-card-content><div class="ir"><strong>Date:</strong> {{ log.created_at | date:'medium' }}</div><div class="ir"><strong>Action:</strong> {{ log.action_type }}</div><div class="ir"><strong>By:</strong> {{ log.causer?.full_name || 'System' }}</div><div class="ir"><strong>Description:</strong></div><pre class="desc">{{ log.description }}</pre></mat-card-content></mat-card> }`,
  styles: ['.ir{padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:.875rem}strong{min-width:100px;display:inline-block}.desc{background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:.8125rem}'],
})
export class ActivityLogsDetailsComponent { @Input() log: any; }
