import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-error-logs-statistics', standalone: true, imports: [CommonModule, MatCardModule],
  template: `<mat-card><mat-card-header><mat-card-title>Error Statistics</mat-card-title></mat-card-header><mat-card-content><p style="text-align:center;padding:32px;color:#666">Error statistics chart - ready for Chart.js integration</p></mat-card-content></mat-card>`,
})
export class ErrorLogsStatisticsComponent {}
