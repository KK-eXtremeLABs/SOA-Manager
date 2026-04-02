import { Component, Input, OnInit } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { BillingService } from '../../accounting/billing/billing.service';
@Component({
  selector: 'app-billing-history', standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe, MatCardModule, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <mat-card><mat-card-header><mat-card-title>Billing History</mat-card-title></mat-card-header><mat-card-content>
      @if (loading) { <div style="display:flex;justify-content:center;padding:24px"><mat-spinner diameter="30"></mat-spinner></div> }
      @if (!loading) {
        <table style="width:100%;border-collapse:collapse;font-size:.875rem"><thead><tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Reference</th><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Date</th><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Amount</th><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Status</th></tr></thead><tbody>
          @for (item of dataList | paginate: paginator; track item.id) { <tr><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.reference }}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.bill_date | date:'mediumDate' }}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.total_amount | currency:'AED ':'symbol':'0.2-2' }}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.status }}</td></tr> }
          @if (dataList.length === 0) { <tr><td colspan="4" style="text-align:center;padding:24px;color:#999">No billing history</td></tr> }
        </tbody></table>
      }
    </mat-card-content></mat-card>
  `,
})
export class BillingHistoryComponent implements OnInit {
  @Input() companyId!:number;loading=false;dataList:any[]=[];paginator:any={itemsPerPage:10,currentPage:1,totalItems:0,from:0,to:0};
  constructor(private billing:BillingService){}
  ngOnInit(){if(this.companyId)this.getData();}
  getData(){this.loading=true;this.billing.getList({where:[{column:'company_id',value:this.companyId}]},this.paginator.currentPage,10).subscribe({next:(d:any)=>{if(d.status==='success')this.dataList=d.record.data||[];this.loading=false;},error:()=>{this.loading=false;}});}
}
