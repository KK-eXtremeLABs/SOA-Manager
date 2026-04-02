import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-error-logs-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule],
  template: `<mat-card><mat-card-header><mat-card-title>Error Log Details</mat-card-title></mat-card-header><mat-card-content><p>Component ready for implementation</p></mat-card-content></mat-card>`,
})
export class ErrorLogsDetailsComponent {}
