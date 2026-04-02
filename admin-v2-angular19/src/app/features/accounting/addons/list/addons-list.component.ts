import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { AddonsService } from '../addons.service';
import { Helpers } from '../../../../core/utils/helpers';
@Component({
  selector: 'app-addons-list', standalone: true,
  imports: [CommonModule, FormsModule, CurrencyPipe, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  template: `
    <h4>Add-ons</h4>
    @if (pageLoader) { <div class="lo"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!pageLoader) {
      <table class="dt"><thead><tr><th>Name</th><th>Description</th><th>Price</th><th>Actions</th></tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.name }}</td><td>{{ item.description }}</td><td>{{ item.price | currency:'AED ':'symbol':'0.2-2' }}</td>
          <td class="ac"><button mat-icon-button color="warn" (click)="del(item.id)"><mat-icon>delete</mat-icon></button></td></tr>
        } @if (dataList.length===0) { <tr><td colspan="4" class="em">No add-ons</td></tr> }
      </tbody></table>
      <div class="pg"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div>
    }
  `,
  styles: ['h4{color:#c4272e;margin:0 0 16px}.lo{display:flex;justify-content:center;padding:48px 0}.dt{width:100%;border-collapse:collapse;font-size:.875rem}th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #eee}thead th{background:#f5f5f5;font-weight:600}.ac{text-align:right}.em{text-align:center;padding:24px;color:#999}.pg{text-align:center;padding:16px 0}'],
})
export class AddonsListComponent implements OnInit {
  pageLoader=false;dataList:any[]=[];paginator:any={itemsPerPage:20,currentPage:1,totalItems:0,from:0,to:0};
  constructor(private addons:AddonsService,private snackBar:MatSnackBar){}
  ngOnInit(){this.getData();}
  getData(){this.pageLoader=true;this.addons.getList({orderBy:{name:'asc'}},this.paginator.currentPage,this.paginator.itemsPerPage).subscribe({next:(d:any)=>{if(d.status==='success'){this.dataList=d.record.data||d.record;const p=d.record.paginator;if(p)this.paginator={...this.paginator,...p,totalItems:p.total,currentPage:p.current_page};}this.pageLoader=false;},error:()=>{this.pageLoader=false;}});}
  changePage(p:number){this.paginator.currentPage=p;this.getData();}
  del(id:number){this.addons.delete(id).subscribe(()=>{this.snackBar.open('Deleted','Close',{duration:3000});this.getData();});}
}
