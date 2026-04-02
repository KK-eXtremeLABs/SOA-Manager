import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxPaginationModule } from 'ngx-pagination';
import { VendorsService } from '../vendors.service';
import { ProfileService } from '../../../core/services/profile.service';
import { Helpers } from '../../../core/utils/helpers';

@Component({
  selector: 'app-list-vendors', standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, MatButtonModule, MatIconModule, MatProgressSpinnerModule, NgxPaginationModule],
  templateUrl: './list-vendors.component.html', styleUrl: './list-vendors.component.scss',
})
export class ListVendorsComponent implements OnInit {
  pageLoader = false; dataList: any[] = []; error: string | null = null;
  where: any[] = []; order: any = { company_name: 'asc' };
  searchData: any = {
    company_name: { column: 'company_name', operator: 'like', value: '' },
    contact_email: { column: 'contact_email', operator: 'like', value: '' },
    license_number: { column: 'license_number', operator: 'like', value: '' },
  };
  paginator: any = { itemsPerPage: 20, currentPage: 1, totalItems: 0, from: 0, to: 0 };

  constructor(private titleService: Title, private route: ActivatedRoute, private vendorService: VendorsService, private profileService: ProfileService) { this.titleService.setTitle('Vendors'); }
  ngOnInit(): void { this.route.queryParams.subscribe(p => { this.paginator.currentPage = p['page'] || 1; this.search(); }); }
  getData(): void {
    this.error = null; this.pageLoader = true;
    this.vendorService.getList({ where: this.where, orderBy: this.order }, this.paginator.currentPage, this.paginator.itemsPerPage).subscribe({
      next: (d: any) => { if (d.status === 'success') { this.dataList = d.record.data || []; if (d.record.paginator) this.paginator = { ...this.paginator, ...d.record.paginator, totalItems: d.record.paginator.total, currentPage: d.record.paginator.current_page }; } this.pageLoader = false; },
      error: (e) => { this.error = e.message; this.pageLoader = false; },
    });
  }
  search(): void { this.where = Helpers.buildWhere(this.searchData); this.getData(); }
  clearFilter(): void { for (const k in this.searchData) this.searchData[k].value = ''; this.search(); }
  sort(col: string): void { this.order = this.order[col] ? { [col]: this.order[col] === 'asc' ? 'desc' : 'asc' } : { [col]: 'asc' }; this.search(); }
  changePage(p: number): void { this.paginator.currentPage = p; this.search(); }
}
