import { Component, OnInit, Input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@Component({
  selector: 'app-list-bank-accounts',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  template: `<mat-card><mat-card-header><mat-card-title>Bank Accounts</mat-card-title></mat-card-header><mat-card-content><p style="color:#666;font-style:italic;padding:24px 0;text-align:center">Account Name|Bank|Branch|Account Number</p></mat-card-content></mat-card>`,
  styles: [],
})
export class ListBankAccountsComponent implements OnInit {
  @Input() associationId: number | null = null;
  loading = false; dataList: any[] = [];
  ngOnInit(): void {}
}
