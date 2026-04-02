import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
@Component({ selector: 'app-exception-logs-statistics', standalone: true, imports: [CommonModule, MatCardModule],
  template: `<mat-card><mat-card-header><mat-card-title>Exception Statistics</mat-card-title></mat-card-header><mat-card-content><p style="text-align:center;padding:32px;color:#666">Exception statistics chart - ready for Chart.js integration</p></mat-card-content></mat-card>`,
})
export class ExceptionLogsStatisticsComponent {}
