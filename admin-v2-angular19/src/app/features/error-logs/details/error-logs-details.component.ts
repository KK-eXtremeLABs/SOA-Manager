import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-error-logs-details', standalone: true, imports: [CommonModule, DatePipe, MatCardModule],
  template: `@if (log) { <mat-card><mat-card-header><mat-card-title>Error Log Details</mat-card-title></mat-card-header><mat-card-content><div class="ir"><strong>Date:</strong> {{ log.created_at | date:'medium' }}</div><div class="ir"><strong>Company:</strong> {{ log.company?.company_name }}</div><div class="ir"><strong>Exception:</strong> {{ log.exception }}</div><div class="ir"><strong>Message:</strong></div><pre class="msg">{{ log.message }}</pre>@if (log.trace) { <div class="ir"><strong>Stack Trace:</strong></div><pre class="trace">{{ log.trace }}</pre> }</mat-card-content></mat-card> }`,
  styles: ['.ir{padding:8px 0;border-bottom:1px solid #f0f0f0;font-size:.875rem}strong{min-width:100px;display:inline-block}.msg{background:#fff3e0;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:.8125rem;max-height:200px;overflow:auto}.trace{background:#f5f5f5;padding:12px;border-radius:4px;white-space:pre-wrap;font-size:.75rem;max-height:300px;overflow:auto}'],
})
export class ErrorLogsDetailsComponent { @Input() log: any; }
