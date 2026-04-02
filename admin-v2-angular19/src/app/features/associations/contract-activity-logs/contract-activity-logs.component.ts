import { Component, OnInit, Input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-contract-activity-logs',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `<mat-card><mat-card-header><mat-card-title>Contract Activity</mat-card-title></mat-card-header><mat-card-content><p style="color:#666;font-style:italic;padding:24px 0;text-align:center">Contract activity timeline</p></mat-card-content></mat-card>`,
  styles: [],
})
export class ContractActivityLogsComponent implements OnInit {
  @Input() associationId: number | null = null;
  loading = false; dataList: any[] = [];
  ngOnInit(): void {}
}
