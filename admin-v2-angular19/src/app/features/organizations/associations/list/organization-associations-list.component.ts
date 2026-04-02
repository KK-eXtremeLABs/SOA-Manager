import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { AssociationService } from '../../../associations/association.service';
@Component({
  selector: 'app-org-associations', standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <mat-card><mat-card-header><mat-card-title>Associations</mat-card-title></mat-card-header><mat-card-content>
      @if (loading) { <div style="display:flex;justify-content:center;padding:24px"><mat-spinner diameter="30"></mat-spinner></div> }
      @if (!loading) {
        <table style="width:100%;border-collapse:collapse;font-size:.875rem"><thead><tr><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Name</th><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Email</th><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Phone</th><th style="padding:8px 12px;text-align:left;border-bottom:1px solid #eee;background:#f5f5f5">Status</th></tr></thead><tbody>
          @for (item of dataList | paginate: paginator; track item.id) { <tr><td style="padding:8px 12px;border-bottom:1px solid #eee"><a [routerLink]="'/associations/details/' + item.id" style="color:#c4272e">{{ item.name }}</a></td><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.email }}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.phone }}</td><td style="padding:8px 12px;border-bottom:1px solid #eee">{{ item.subscription_status }}</td></tr> }
          @if (dataList.length === 0) { <tr><td colspan="4" style="text-align:center;padding:24px;color:#999">No associations</td></tr> }
        </tbody></table>
        <div style="text-align:center;padding:12px 0"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div>
      }
    </mat-card-content></mat-card>
  `,
})
export class OrganizationAssociationListComponent implements OnInit {
  @Input() companyId!: number;
  loading=false;dataList:any[]=[];paginator:any={itemsPerPage:10,currentPage:1,totalItems:0,from:0,to:0};
  constructor(private assocService:AssociationService){}
  ngOnInit(){if(this.companyId)this.getData();}
  getData(){this.loading=true;this.assocService.getList({where:[{column:'company_id',value:this.companyId}]},this.paginator.currentPage,this.paginator.itemsPerPage).subscribe({next:(d:any)=>{if(d.status==='success'){this.dataList=d.record.data||[];const p=d.record.paginator;if(p)this.paginator={...this.paginator,...p,totalItems:p.total,currentPage:p.current_page};}this.loading=false;},error:()=>{this.loading=false;}});}
  changePage(p:number){this.paginator.currentPage=p;this.getData();}
}
