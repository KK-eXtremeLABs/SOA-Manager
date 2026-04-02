import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { PricingService } from '../pricing.service';
import { Helpers } from '../../../../core/utils/helpers';
@Component({
  selector: 'app-pricing-list', standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <div class="header-row"><h4>Pricing Plans</h4></div>
    @if (pageLoader) { <div class="lo"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!pageLoader) {
      <div class="filter-row"><input type="text" [(ngModel)]="searchData.name.value" (keyup.enter)="search()" placeholder="Search name..." class="fi" />
        <button mat-icon-button color="primary" (click)="search()"><mat-icon>search</mat-icon></button>
        <button mat-icon-button color="warn" (click)="clearFilter()"><mat-icon>close</mat-icon></button></div>
      <table class="dt"><thead><tr><th class="p" (click)="sort('name')">Name</th><th>Description</th><th>Amount</th><th>Type</th><th>Actions</th></tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.name }}</td><td>{{ item.description }}</td><td>{{ item.amount | currency:'AED ':'symbol':'0.2-2' }}</td><td>{{ item.type }}</td>
          <td class="ac"><button mat-icon-button color="warn" (click)="deleteItem(item.id)"><mat-icon>delete</mat-icon></button></td></tr>
        } @if (dataList.length === 0) { <tr><td colspan="5" class="em">No pricing plans</td></tr> }
      </tbody></table>
      <div class="pg"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div>
    }
  `,
  styles: ['.header-row{display:flex;justify-content:space-between;align-items:center}h4{color:#c4272e;margin:0 0 16px}.lo{display:flex;justify-content:center;padding:48px 0}.filter-row{display:flex;gap:8px;align-items:center;margin-bottom:16px}.fi{padding:8px;border:1px solid #ddd;border-radius:4px}.dt{width:100%;border-collapse:collapse;font-size:.875rem}th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #eee}thead th{background:#f5f5f5;font-weight:600}.p{cursor:pointer}.ac{text-align:right;white-space:nowrap}.em{text-align:center;padding:24px;color:#999}.pg{text-align:center;padding:16px 0}'],
})
export class PricingListComponent implements OnInit {
  pageLoader=false;dataList:any[]=[];where:any[]=[];order:any={name:'asc'};
  searchData:any={name:{column:'name',operator:'like',value:''}};
  paginator:any={itemsPerPage:20,currentPage:1,totalItems:0,from:0,to:0};
  constructor(private pricing:PricingService,private snackBar:MatSnackBar){}
  ngOnInit(){this.search();}
  getData(){this.pageLoader=true;this.pricing.getList({where:this.where,orderBy:this.order},this.paginator.currentPage,this.paginator.itemsPerPage).subscribe({next:(d:any)=>{if(d.status==='success'){this.dataList=d.record.data||d.record;const p=d.record.paginator;if(p)this.paginator={...this.paginator,...p,totalItems:p.total,currentPage:p.current_page};}this.pageLoader=false;},error:()=>{this.pageLoader=false;}});}
  search(){this.where=Helpers.buildWhere(this.searchData);this.getData();}
  clearFilter(){for(const k in this.searchData)this.searchData[k].value='';this.search();}
  sort(c:string){this.order=this.order[c]?{[c]:this.order[c]==='asc'?'desc':'asc'}:{[c]:'asc'};this.search();}
  changePage(p:number){this.paginator.currentPage=p;this.search();}
  deleteItem(id:number){this.pricing.delete(id).subscribe(()=>{this.snackBar.open('Deleted','Close',{duration:3000});this.search();});}
}
