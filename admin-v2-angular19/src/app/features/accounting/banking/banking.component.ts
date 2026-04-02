import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
@Component({
  selector: 'app-banking',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, CurrencyPipe, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <h4>Bank Statements</h4>
    @if (loading) { <div style="display:flex;justify-content:center;padding:48px 0"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!loading) {
      <mat-card><mat-card-content>
        @if (dataList.length > 0) {
          <table style="width:100%;border-collapse:collapse;font-size:.875rem"><thead><tr>
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5;font-weight:600">Date</th>
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5;font-weight:600">Reference</th>
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5;font-weight:600">Description</th>
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5;font-weight:600">Amount</th>
            <th style="padding:10px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5;font-weight:600">Type</th>
          </tr></thead><tbody>
            @for (item of dataList | paginate: paginator; track $index) {
              <tr><td style="padding:10px 12px;border-bottom:1px solid #eee">{{ item.date || item.datetime || item.created_at }}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee">{{ item.reference || item.trx_number || item.id }}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee">{{ item.description || item.note || item.memo || '-' }}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee">{{ item.amount | currency:'AED ':'symbol':'0.2-2' }}</td>
              <td style="padding:10px 12px;border-bottom:1px solid #eee">{{ item.type || '-' }}</td></tr>
            }
          </tbody></table>
          <div style="text-align:center;padding:16px 0"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div>
        } @else { <p style="text-align:center;padding:48px;color:#999">No data available</p> }
      </mat-card-content></mat-card>
    }
  `,
  styles: ['h4{color:#c4272e;margin:0 0 16px}'],
})
export class BankingComponent implements OnInit {
  loading=false;dataList:any[]=[];
  paginator:any={itemsPerPage:20,currentPage:1,totalItems:0,from:0,to:0};
  ngOnInit(){this.loading=false;}
  changePage(p:number){this.paginator.currentPage=p;}
}
