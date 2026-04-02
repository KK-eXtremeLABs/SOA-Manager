import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NgxPaginationModule } from 'ngx-pagination';
import { RolesService } from '../roles.service';
import { Helpers } from '../../../core/utils/helpers';
import { CanAccessPipe } from '../../../shared/pipes/can-access.pipe';
@Component({
  selector: 'app-roles-list', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule, CanAccessPipe],
  template: `
    <div class="hdr"><h3>Roles</h3><div>
      @if ('admin_roles_add' | canAccess) { <a mat-raised-button color="primary" routerLink="/roles/add"><mat-icon>add</mat-icon> Add Role</a> }
    </div></div>
    @if (loading) { <div style="display:flex;justify-content:center;padding:48px 0"><mat-spinner diameter="40"></mat-spinner></div> }
    @if (!loading) {
      <div class="fr"><input type="text" [(ngModel)]="searchData.title.value" (keyup.enter)="search()" placeholder="Search role..." class="fi" />
        <button mat-icon-button color="primary" (click)="search()"><mat-icon>search</mat-icon></button>
        <button mat-icon-button color="warn" (click)="clearFilter()"><mat-icon>close</mat-icon></button></div>
      <section class="ts"><table class="dt"><thead><tr><th class="p" (click)="sort('title')">Name</th><th>Description</th><th>Actions</th></tr></thead><tbody>
        @for (item of dataList | paginate: paginator; track item.id) {
          <tr><td>{{ item.title }}</td><td>{{ item.description }}</td>
          <td class="ac">@if ('admin_roles_update' | canAccess) { <a mat-icon-button [routerLink]="'/roles/edit/' + item.id"><mat-icon>edit</mat-icon></a> }
          <button mat-icon-button color="warn" (click)="del(item.id)"><mat-icon>delete</mat-icon></button></td></tr>
        } @if (dataList.length===0) { <tr><td colspan="3" class="em">No roles found</td></tr> }
      </tbody></table>
      <div class="pg"><pagination-controls (pageChange)="changePage($event)"></pagination-controls></div></section>
    }
  `,
  styles: ['.hdr{display:flex;justify-content:space-between;align-items:center;margin-bottom:16px}h3{color:#c4272e;margin:0}.fr{display:flex;gap:8px;align-items:center;margin-bottom:16px}.fi{padding:8px;border:1px solid #ddd;border-radius:4px}.ts{background:white;border-radius:8px;padding:16px;box-shadow:0 1px 3px rgba(0,0,0,.1)}.dt{width:100%;border-collapse:collapse;font-size:.875rem}th,td{padding:10px 12px;text-align:left;border-bottom:1px solid #eee}thead th{background:#f5f5f5;font-weight:600}.p{cursor:pointer}.ac{text-align:right;white-space:nowrap}.em{text-align:center;padding:24px;color:#999}.pg{text-align:center;padding:16px 0}'],
})
export class RolesListComponent implements OnInit {
  loading=false;dataList:any[]=[];where:any[]=[];order:any={title:'asc'};
  searchData:any={title:{column:'title',operator:'like',value:''}};
  paginator:any={itemsPerPage:20,currentPage:1,totalItems:0,from:0,to:0};
  constructor(private roles:RolesService,private snackBar:MatSnackBar){}
  ngOnInit(){this.search();}
  getData(){this.loading=true;this.roles.getList({where:this.where,orderBy:this.order},this.paginator.currentPage,this.paginator.itemsPerPage).subscribe({next:(d:any)=>{if(d.status==='success'){this.dataList=d.record.data||d.record;const p=d.record.paginator;if(p)this.paginator={...this.paginator,...p,totalItems:p.total,currentPage:p.current_page};}this.loading=false;},error:()=>{this.loading=false;}});}
  search(){this.where=Helpers.buildWhere(this.searchData);this.getData();}
  clearFilter(){for(const k in this.searchData)this.searchData[k].value='';this.search();}
  sort(c:string){this.order=this.order[c]?{[c]:this.order[c]==='asc'?'desc':'asc'}:{[c]:'asc'};this.search();}
  changePage(p:number){this.paginator.currentPage=p;this.search();}
  del(id:number){this.roles.delete(id).subscribe(()=>{this.snackBar.open('Role deleted','Close',{duration:3000});this.search();});}
}
